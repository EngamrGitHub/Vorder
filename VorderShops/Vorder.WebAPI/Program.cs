using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;
using Vorder.Application.Mapper;
using Vorder.Domain.Constants;
using Vorder.Domain.Models;
using Vorder.Infrastructure.Data;
using Vorder.WebAPI.Middleware;
using Vorder.Application;

var builder = WebApplication.CreateBuilder(args);

#region log
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Debug);
#endregion

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddMapsterConfiguration();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Vorder API",
        Version = "v1",
        Description = "Vorder Web API"

    });
    // Temporarily commented out to show all authentication and register endpoints in Swagger UI for testing
    /*
    c.DocInclusionPredicate((docName, apiDesc) =>
    {
        if (apiDesc.RelativePath is null)
            return false;
        if (apiDesc.RelativePath.Contains("register") || apiDesc.RelativePath.Contains("confirmEmail")
         || apiDesc.RelativePath.Contains("login") || apiDesc.RelativePath.Contains("refresh")
          || apiDesc.RelativePath.Contains("resendConfirmationEmail") || apiDesc.RelativePath.Contains("forgotPassword")
           || apiDesc.RelativePath.Contains("resetPassword") || apiDesc.RelativePath.Contains("2fa"))
            return false;
        return true;
    });
    */
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
builder.Services.AddControllers();

builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
{
    options.SignIn.RequireConfirmedAccount = true;
    options.User.RequireUniqueEmail = true;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddApiEndpoints();

builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApplicationServices();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

EmailConfiguration? emailConfig = builder.Configuration.GetSection("EmailConfiguration").Get<EmailConfiguration>();
builder.Services.AddSingleton(emailConfig!);

builder.Services.AddAuthorizationBuilder()
    .AddPolicy(ApplicationRoles.AdminPolicy, policy => policy.RequireRole(ApplicationRoles.Admin))
    .AddPolicy(ApplicationRoles.ShopOwnerPolicy, policy => policy.RequireRole(ApplicationRoles.ShopOwner))
    .AddPolicy(ApplicationRoles.CustomerPolicy, policy => policy.RequireRole(ApplicationRoles.Customer))
    .AddPolicy(ApplicationRoles.AdminOrShopOwner, policy =>
        policy.RequireRole(ApplicationRoles.Admin, ApplicationRoles.ShopOwner));

var app = builder.Build();
app.UsePathBase("/Vorder");
app.UseSwagger();
app.UseSwaggerUI();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/Vorder/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = string.Empty;
});

var roleManager = app.Services.CreateScope().ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
if (!await roleManager.RoleExistsAsync(ApplicationRoles.Admin))
    await roleManager.CreateAsync(new IdentityRole<Guid>(ApplicationRoles.Admin) { NormalizedName = ApplicationRoles.AdminNormalizedName });
if (!await roleManager.RoleExistsAsync(ApplicationRoles.ShopOwner))
    await roleManager.CreateAsync(new IdentityRole<Guid>(ApplicationRoles.ShopOwner) { NormalizedName = ApplicationRoles.ShopOwnerNormalizedName });
if (!await roleManager.RoleExistsAsync(ApplicationRoles.Customer))
    await roleManager.CreateAsync(new IdentityRole<Guid>(ApplicationRoles.Customer) { NormalizedName = ApplicationRoles.CustomerNormalizedName });

app.UseHttpsRedirection();
app.UseMiddleware<RequestLoggingMiddleware>();
app.UseMiddleware<ShopSubdomainValidationMiddleware>();

app.UseRouting();

app.UseCors("AllowAll");
Directory.CreateDirectory(PictureConstants.DefaultShopPath);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(PictureConstants.DefaultShopPath),
    RequestPath = PictureConstants.DefaultRequestPath
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapIdentityApi<ApplicationUser>();

app.Run();