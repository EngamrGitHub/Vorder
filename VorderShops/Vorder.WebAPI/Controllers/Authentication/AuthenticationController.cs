using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Vorder.Application.DTOs.Authentication;
using Vorder.Application.Interfaces.Services.Email;
using Vorder.Application.ResultPattern;
using Vorder.Domain.Models;
using Vorder.Infrastructure.Data;
using Vorder.Domain.Constants;
using Vorder.Infrastructure.Services.Email;
using Vorder.WebAPI.Helpers;
using Mapster;
using Vorder.Application.Interfaces.Repositories;

namespace Vorder.WebAPI.Controllers.Authentication
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class AuthenticationController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> _signInManager, IConfiguration _config,
                                    IEmailService emailSender, IShopRepository shopRepository) : ControllerBase
    {

        [HttpPost(Name = "Register")]
        public async Task<ActionResult<ApplicationResult<UserDto>>> Register(RegisterDto model)
        {
            if (model.Password != model.ConfirmPassword)
                return ApiResponseStatus.BadRequest<UserDto>(Errors.ValidationError(ErrorConstants.PASSWORDMISMATCH, ErrorConstants.PASSWORDMISMATCHCODE));

            if (model.Email is null)
                return ApiResponseStatus.BadRequest<UserDto>(Errors.ValidationError());

            bool isPhoneValid = Regex.IsMatch(model.PhoneNumber, RegexConstants.EgyptianPhoneNumberPattern, RegexOptions.IgnoreCase);
            if (!isPhoneValid)
                return ApiResponseStatus.BadRequest<UserDto>(Errors.ValidationError(ErrorConstants.PHONENUMBERERROR, ErrorConstants.PHONENUMBERERRORCODE));

            model.Email = model.Email.ToLower();
            var user = new ApplicationUser { FullName = model.FullName, UserName = model.Email, Email = model.Email, PhoneNumber = model.PhoneNumber };
            var result = await userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                IdentityError? error = result.Errors.FirstOrDefault();
                if (error is not null)
                    return ApiResponseStatus.BadRequest<UserDto>(Errors.ValidationError(error.Description, error.Code));
                else
                    return ApiResponseStatus.BadRequest<UserDto>(Errors.ValidationError());
            }

            string token = ShortEmailTokenProvider.GenerateShortToken();

            string emailBody = EmailConstants.GetConfirmationEmailBody(token);

            await userManager.SetAuthenticationTokenAsync(user, "Vorder", "EmailConfirmation", token);

            EmailMessage emailMessage = new EmailMessage(EmailConstants.ConfirmationSubject
                , emailBody
                , model.Email);

            await emailSender.SendEmail(emailMessage, EmailConstants.ConfirmationSubject);

            return ApiResponseStatus.Ok<UserDto>(user.Adapt<UserDto>());
        }


        [HttpPost(Name = "ConfirmEmail")]
        public async Task<ActionResult<ApplicationResult<string>>> ConfirmEmail(ConfirmEmailModel confirmEmailModel)
        {
            var user = await userManager.FindByIdAsync(confirmEmailModel.UserID.ToString());
            if (user == null) return ApiResponseStatus.NotFound<string>(Errors.NotFound(ErrorConstants.USERNOTFOUND, ErrorConstants.USERNOTFOUNDCODE));

            var storedToken = await userManager.GetAuthenticationTokenAsync(user, "Vorder", "EmailConfirmation");

            if (storedToken == confirmEmailModel.ConfirmationToken)
            {
                user.EmailConfirmed = true;
                await userManager.UpdateAsync(user);
                await userManager.RemoveAuthenticationTokenAsync(user, "Vorder", "EmailConfirmation");
            }
            else
                return ApiResponseStatus.NotFound<string>(Errors.ValidationError(ErrorConstants.EMAILCONFIRMATIONFAILED, ErrorConstants.EMAILCONFIRMATIONFAILEDCODE));

            return ApiResponseStatus.Ok<string>("Email confirmed! You can now log in.");
        }


        [HttpPost(Name = "GoogleLogin")]
        public async Task<ActionResult<ApplicationResult<JwtTokenModel>>> GoogleLogin(string token)
        {
            GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(token);
            }
            catch (Exception)
            {
                return ApiResponseStatus.Unauthorized<JwtTokenModel>(Errors.Unauthorized(ErrorConstants.INVALIDUSER, ErrorConstants.INVALIDUSERCODE));
            }

            var user = await userManager.FindByEmailAsync(payload.Email);
            if (user is null)
            {
                user = new ApplicationUser
                {
                    Email = payload.Email,
                    UserName = payload.Email,
                    FullName = payload.Name,
                    EmailConfirmed = true
                };
                var createResult = await userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                {
                    IdentityError? createError = createResult.Errors.FirstOrDefault();
                    return ApiResponseStatus.BadRequest<JwtTokenModel>(Errors.ValidationError(
                        createError?.Description ?? "Failed to create user account",
                        createError?.Code ?? "USER CREATE FAILED"));
                }
            }

            UserLoginInfo info = new UserLoginInfo("Google", payload.Subject, "Google");
            var userLogins = await userManager.GetLoginsAsync(user);
            if (!userLogins.Any(l => l.LoginProvider == "Google"))
                await userManager.AddLoginAsync(user, info);

            JwtTokenModel tokenModel = new JwtTokenModel
            {
                Token = await GenerateJwtToken(user, true),
                TokenExpiryHours = 2,
                TokenExpiration = DateTime.Now.AddHours(2),
                RefreshToken = await GenerateJwtToken(user, false),
                RefreshTokenExpiryHours = 24,
                RefreshTokenExpiration = DateTime.Now.AddDays(1)
            };
            return ApiResponseStatus.Ok<JwtTokenModel>(tokenModel);
        }


        [HttpPost(Name = "Login")]
        public async Task<ActionResult<ApplicationResult<JwtTokenModel>>> Login(LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email.ToLower());
            if (user is null)
                return ApiResponseStatus.Unauthorized<JwtTokenModel>(Errors.Unauthorized(ErrorConstants.INVALIDUSER, ErrorConstants.INVALIDUSERCODE));

            var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, isPersistent: false, lockoutOnFailure: false);

            if (!result.Succeeded)
                return ApiResponseStatus.Unauthorized<JwtTokenModel>(Errors.Unauthorized(ErrorConstants.INVALIDUSER, ErrorConstants.INVALIDUSERCODE));

            await _signInManager.SignInAsync(user, isPersistent: false);
            JwtTokenModel tokenModel = new JwtTokenModel
            {
                Token = await GenerateJwtToken(user, true),
                TokenExpiryHours = 2,
                TokenExpiration = DateTime.Now.AddHours(2),
                RefreshToken = await GenerateJwtToken(user, false),
                RefreshTokenExpiryHours = 24,
                RefreshTokenExpiration = DateTime.Now.AddDays(1)
            };
            user.RefreshToken = tokenModel.RefreshToken;
            user.RefreshTokenExpiryTime = tokenModel.RefreshTokenExpiration;
            await userManager.UpdateAsync(user);

            return ApiResponseStatus.Ok<JwtTokenModel>(tokenModel);
        }


        [HttpPost(Name = "RefreshToken")]
        public async Task<ActionResult<ApplicationResult<JwtTokenWithoutRefreshTokenModel>>> RefreshToken(RefreshTokenModel RefreshTokenModel)
        {
            var user = await userManager.FindByIdAsync(RefreshTokenModel.UserID);
            if (user is null || user.RefreshToken != RefreshTokenModel.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
                return ApiResponseStatus.Unauthorized<JwtTokenWithoutRefreshTokenModel>(Errors.Unauthorized(ErrorConstants.INVALIDREFRESHTOKEN, ErrorConstants.INVALIDREFRESHTOKENCODE));

            JwtTokenWithoutRefreshTokenModel tokenModel = new JwtTokenWithoutRefreshTokenModel
            {
                Token = await GenerateJwtToken(user, true),
                ExpiryHours = 2,
                Expiration = DateTime.Now.AddHours(2)
            };
            return ApiResponseStatus.Ok<JwtTokenWithoutRefreshTokenModel>(tokenModel);
        }


        [HttpPost(Name = "ForgotPassword")]
        public async Task<ActionResult<ApplicationResult<string>>> ForgotPassword(string Email)
        {
            ApplicationUser? user = await userManager.FindByEmailAsync(Email.ToLower());
            if (user is null)
                return ApiResponseStatus.NotFound<string>(Errors.NotFound(ErrorConstants.INVALIDEMAIL, ErrorConstants.INVALIDEMAILCODE));
            
            string token = ShortEmailTokenProvider.GenerateShortToken();

            string emailBody = EmailConstants.GetResetPasswordBody(token);

            await userManager.SetAuthenticationTokenAsync(user, "Vorder", "ResetPassword", token);

            EmailMessage emailMessage = new EmailMessage(EmailConstants.ResetPasswordSubject
                , emailBody
                , Email.ToLower());

            await emailSender.SendEmail(emailMessage, EmailConstants.ResetPasswordSubject);

            return ApiResponseStatus.Ok<string>("Password reset token sent to your email.");
        }


        [HttpPost(Name = "ResetPassword")]
        public async Task<ActionResult<ApplicationResult<string>>> ResetPassword(ResetPasswordModel resetPassword)
        {
            ApplicationUser? user = await userManager.FindByEmailAsync(resetPassword.Email.ToLower());
            if (user is null)
                return ApiResponseStatus.NotFound<string>(Errors.NotFound(ErrorConstants.INVALIDEMAIL, ErrorConstants.INVALIDEMAILCODE));
            

            var storedToken = await userManager.GetAuthenticationTokenAsync(user, "Vorder", "ResetPassword");

            if (storedToken != resetPassword.ResetToken)
                return ApiResponseStatus.BadRequest<string>(Errors.ValidationError());
            
            foreach (var validator in userManager.PasswordValidators)
            {
                var validationResult = await validator.ValidateAsync(userManager, user, resetPassword.NewPassword);
                if (!validationResult.Succeeded)
                {
                    var error = validationResult.Errors.FirstOrDefault();
                    if (error is not null)
                        return ApiResponseStatus.BadRequest<string>(Errors.ValidationError(error.Description, error.Code));
                    else
                        return ApiResponseStatus.BadRequest<string>(Errors.ValidationError());
                }
            }
            await userManager.RemovePasswordAsync(user);
            await userManager.AddPasswordAsync(user, resetPassword.NewPassword);

            await userManager.RemoveAuthenticationTokenAsync(user, "Vorder", "ResetPassword");

            return ApiResponseStatus.Ok<string>("Password has been reset successfully.");
        }


        [HttpGet(Name = "ResendConfirmationEmail")]
        public async Task<ActionResult<ApplicationResult<string>>> ResendConfirmationEmail(string Email)
        {
            ApplicationUser? user = await userManager.FindByEmailAsync(Email.ToLower());
            if (user is null)
                return ApiResponseStatus.NotFound<string>(Errors.NotFound(ErrorConstants.INVALIDEMAIL, ErrorConstants.INVALIDEMAILCODE));

            if (user.EmailConfirmed)
                return ApiResponseStatus.BadRequest<string>("Email is already confirmed.");

            string token = ShortEmailTokenProvider.GenerateShortToken();

            string emailBody = EmailConstants.GetConfirmationEmailBody(token);

            await userManager.SetAuthenticationTokenAsync(user, "Vorder", "EmailConfirmation", token);

            EmailMessage emailMessage = new EmailMessage(EmailConstants.ConfirmationSubject
                , emailBody
                , Email);

            await emailSender.SendEmail(emailMessage, EmailConstants.ConfirmationSubject);

            return ApiResponseStatus.Ok<string>("Confirmation Email Sent Successfully.");
        }


        #region Business

        private async Task<string> GenerateJwtToken(ApplicationUser user, bool isToken)
        {
            var roles = await userManager.GetRolesAsync(user);
            if (!roles.Any())
            {
                roles.Add(ApplicationRoles.Customer);
            }
            
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
                new Claim(ClaimTypes.Role, roles.FirstOrDefault() ?? string.Empty),
                new Claim("TenantID", user.ShopID?.ToString() ?? string.Empty)
            };

            if (user.ShopID.HasValue)
            {
                var shop = await shopRepository.GetByIdAsync(user.ShopID.Value);
                if (shop != null)
                {
                    claims.Add(new Claim("shop_name", shop.Name));
                }
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: isToken ? DateTime.Now.AddHours(2) : DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        #endregion
    }
}
