using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vorder.Application.DTOs.Shop;
using Vorder.Application.Interfaces.Repositories;
using Vorder.Application.ResultPattern;
using Vorder.Domain.Entities;
using Vorder.Infrastructure.Data;
using Vorder.WebAPI.Helpers;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Vorder.Domain.Constants;

namespace Vorder.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class ShopController(IShopRepository shopRepository, UserManager<ApplicationUser> _userManager, IConfiguration _config) : ControllerBase
    {
        //[Authorize(Policy = ApplicationRoles.AdminPolicy)]
        [HttpGet(Name = "GetPaginatedShops")]
        public async Task<ActionResult<ApplicationResult<List<ResponseShopDto>>>> GetPaginatedShops(int PageNumber, int PageSize)
        {
            var shops = await shopRepository.GetPagedAsync(PageNumber, PageSize, null);
            List<ResponseShopDto> shopsList = [];
            foreach (var shop in shops)
            {
                string username = await SubdomainHelper.GetUsernameByID(shop.OwnerId, _userManager);
                shopsList.Add(shop.Adapt<ResponseShopDto>());
            }
            return ApiResponseStatus.Ok<List<ResponseShopDto>>(shopsList);
        }


        //[Authorize(Policy = ApplicationRoles.AdminPolicy)]
        [HttpGet(Name = "GetShops")]
        public async Task<ActionResult<ApplicationResult<List<ResponseShopDto>>>> GetShops()
        {
            var shops = await shopRepository.GetAllAsync(null);
            List<ResponseShopDto> shopsList = [];
            foreach (var shop in shops)
            {
                string username = await SubdomainHelper.GetUsernameByID(shop.OwnerId, _userManager);
                shopsList.Add(shop.Adapt<ResponseShopDto>());
            }
            return ApiResponseStatus.Ok<List<ResponseShopDto>>(shopsList);
        }


        //[Authorize(Policy = ApplicationRoles.AdminOrShopOwner)]
        [HttpGet(Name = "GetShopByID")]
        public async Task<ActionResult<ApplicationResult<ResponseShopDto>>> GetShopByID(Guid shopID)
        {
            var shop = await shopRepository.GetByIdAsync(shopID);
            if (shop is null)
            {
                Response.StatusCode = StatusCodes.Status404NotFound;
                return ApiResponseStatus.NotFound<ResponseShopDto>(Errors.NotFound(ErrorConstants.SHOPNOTFOUND, ErrorConstants.SHOPNOTFOUNDCODE));
            }
            string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            string? userName = User.FindFirstValue(ClaimTypes.Name);
            if (userIdString is null || userName is null)
            {
                Response.StatusCode = StatusCodes.Status404NotFound;
                return ApiResponseStatus.NotFound<ResponseShopDto>(Errors.NotFound(ErrorConstants.USERNOTFOUND, ErrorConstants.USERNOTFOUNDCODE));
            }
            Guid userId = Guid.Parse(userIdString);
            if (userId != shop.OwnerId)
            {
                return ApiResponseStatus.Forbidden<ResponseShopDto>(Errors.Forbidden(ErrorConstants.FORBIDDEN, ErrorConstants.FORBIDDENCODE));
            }
            return ApiResponseStatus.Ok<ResponseShopDto>(shop.Adapt<ResponseShopDto>());
        }


        //[Authorize(Policy = ApplicationRoles.ShopOwnerPolicy)]
        [HttpPost(Name = "CreateShop")]
        public async Task<ActionResult<ApplicationResult<ResponseCreateShopDto>>> CreateShop([FromForm] CreateShopDto shop)
        {
            string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            string? userName = User.FindFirstValue(ClaimTypes.Name);
            if (userIdString is null || userName is null)
                return ApiResponseStatus.NotFound<ResponseCreateShopDto>(Errors.NotFound(ErrorConstants.USERNOTFOUND, ErrorConstants.USERNOTFOUNDCODE));


            Guid userId = Guid.Parse(userIdString);
            var shopExists = await shopRepository.GetShopByNameAsync(shop.Name);
            if (shopExists is not null)
                return ApiResponseStatus.BadRequest<ResponseCreateShopDto>(Errors.Exists(ErrorConstants.SHOPNAMEEXISTS, ErrorConstants.SHOPNAMEEXISTSCODE));

            try
            {
                shop.LogoUrl = await ImageHelper.SaveImageAsync(shop.Logo);
                shop.FaviconUrl = await ImageHelper.SaveImageAsync(shop.Favicon);
                shop.BannerUrl = await ImageHelper.SaveImageAsync(shop.Banner);
            }
            catch (InvalidDataException e)
            {
                return ApiResponseStatus.BadRequest<ResponseCreateShopDto>(Errors.ValidationError("Cant convert this type to image", e.Message));
            }

            var shopCreated = await shopRepository.AddShopAsync(shop, userId);
            
            var user = await _userManager.FindByIdAsync(userIdString);
            if (user is null)
                return ApiResponseStatus.NotFound<ResponseCreateShopDto>(Errors.NotFound(ErrorConstants.USERNOTFOUND, ErrorConstants.USERNOTFOUNDCODE));

            var token = await GenerateJwtToken(user, shopCreated.Name);

            var result = new ResponseCreateShopDto
            {
                Shop = shopCreated.Adapt<ResponseShopDto>(),
                Token = token
            };

            return ApiResponseStatus.Created<ResponseCreateShopDto>(result);
        }


        //[Authorize(Policy = ApplicationRoles.ShopOwnerPolicy)]
        [HttpPatch("{id:guid}", Name = "UpdateShop")]
        public async Task<ActionResult<ApplicationResult<ResponseShopDto>>> UpdateShop(Guid id, UpdateShopDto shopDto)
        {
            string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            string? userName = User.FindFirstValue(ClaimTypes.Name);
            if (userIdString is null || userName is null)
                return ApiResponseStatus.NotFound<ResponseShopDto>(Errors.NotFound(ErrorConstants.USERNOTFOUND, ErrorConstants.USERNOTFOUNDCODE));

            Guid userId = Guid.Parse(userIdString);

            Shop? existingShop = await shopRepository.GetByIdAsync(id);
            if (existingShop is null)
                return ApiResponseStatus.NotFound<ResponseShopDto>(Errors.NotFound(ErrorConstants.SHOPNOTFOUND, ErrorConstants.SHOPNOTFOUNDCODE));


            if (existingShop.OwnerId != userId)
                return ApiResponseStatus.Forbidden<ResponseShopDto>(Errors.Forbidden(ErrorConstants.FORBIDDEN, ErrorConstants.FORBIDDENCODE));


            try
            {
                if (shopDto.Logo is not null)
                {
                    shopDto.LogoUrl = await ImageHelper.SaveImageAsync(shopDto.Logo);
                    ImageHelper.DeleteImage(existingShop.LogoUrl);
                }
                if (shopDto.Favicon is not null)
                {
                    shopDto.FaviconUrl = await ImageHelper.SaveImageAsync(shopDto.Favicon);
                    ImageHelper.DeleteImage(existingShop.LogoUrl);
                }
                if (shopDto.Banner is not null)
                {
                    shopDto.BannerUrl = await ImageHelper.SaveImageAsync(shopDto.Banner);
                    ImageHelper.DeleteImage(existingShop.LogoUrl);
                }
            }
            catch (InvalidDataException e)
            {
                return ApiResponseStatus.NotFound<ResponseShopDto>(Errors.ValidationError("Cant convert this type to image", e.Message));
            }

            shopDto.Adapt(existingShop);
            existingShop.LastModifierId = userId;
            existingShop.UpdatedDate = DateTime.Now;

            shopRepository.Update(existingShop);
            await shopRepository.SaveChangesAsync();

            return ApiResponseStatus.Ok<ResponseShopDto>(existingShop.Adapt<ResponseShopDto>());
        }


        //[Authorize(Policy = ApplicationRoles.ShopOwnerPolicy)]
        [HttpDelete("{id:guid}", Name = "DeleteShop")]
        public async Task<ActionResult<ApplicationResult<string>>> DeleteShop(Guid id)
        {
            string? userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            string? userName = User.FindFirstValue(ClaimTypes.Name);
            if (userIdString is null || userName is null)
                return ApiResponseStatus.NotFound<string>(Errors.NotFound(ErrorConstants.USERNOTFOUND, ErrorConstants.USERNOTFOUNDCODE));

            Guid userId = Guid.Parse(userIdString);
            Shop? existingShop = await shopRepository.GetByIdAsync(id);
            if (existingShop is null)
                return ApiResponseStatus.NotFound<string>(Errors.NotFound(ErrorConstants.SHOPNOTFOUND, ErrorConstants.SHOPNOTFOUNDCODE));

            if (existingShop.OwnerId != userId)
                return ApiResponseStatus.Forbidden<string>(Errors.Forbidden(ErrorConstants.FORBIDDEN, ErrorConstants.FORBIDDENCODE));

            ImageHelper.DeleteImage(existingShop.LogoUrl);
            ImageHelper.DeleteImage(existingShop.FaviconUrl);
            ImageHelper.DeleteImage(existingShop.BannerUrl);
            shopRepository.Delete(existingShop);
            await shopRepository.SaveChangesAsync();

            return ApiResponseStatus.Ok<string>("Shop Deleted Successfully");
        }

        private async Task<string> GenerateJwtToken(ApplicationUser user, string shopName)
        {
            var roles = await _userManager.GetRolesAsync(user);
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
                new Claim("TenantID", user.ShopID?.ToString() ?? string.Empty),
                new Claim("shop_name", shopName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
