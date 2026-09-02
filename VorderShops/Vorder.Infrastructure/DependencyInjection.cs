using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Vorder.Application.Interfaces;
using Vorder.Application.Interfaces.Repositories;
using Vorder.Application.Interfaces.Services.Email;
using Vorder.Infrastructure.Data;
using Vorder.Infrastructure.Data.Repositories;
using Vorder.Infrastructure.Services;
using Vorder.Infrastructure.Services.Email;

namespace Microsoft.Extensions.DependencyInjection;
public static class DependencyInjection
{

    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly("Vorder.Infrastructure"));

        });


        services.AddScoped<IShopRepository, ShopRepository>();
        services.AddScoped<IRequestLogRepository, RequestLogRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<ISubCategoryRepository, SubCategoryRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        services.AddScoped<IReviewRepository, ReviewRepository>();
        services.AddScoped<IAddressRepository, AddressRepository>();
        services.AddScoped<IMembershipRepository, MembershipRepository>();
        services.AddScoped<IDepartmentRepository, DepartmentRepository>();
        services.AddScoped<IShipperRepository, ShipperRepository>();
        services.AddScoped<IDiscountRepository, DiscountRepository>();
        services.AddScoped<IOfferRepository, OfferRepository>();
        services.AddScoped<IWishlistRepository, WishlistRepository>();
        services.AddScoped<IShoppingCartItemRepository, ShoppingCartItemRepository>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, ApplicationUserClaimsPrincipalFactory>();

        return services;
    }
}

