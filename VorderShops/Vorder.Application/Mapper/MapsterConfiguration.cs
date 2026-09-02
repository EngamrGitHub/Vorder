using Mapster;
using Microsoft.Extensions.DependencyInjection;
using Vorder.Application.DTOs.Shop;
using Vorder.Domain.Entities;

namespace Vorder.Application.Mapper
{
    public static class MapsterConfiguration
    {

        public static void AddMapsterConfiguration(this IServiceCollection services)
        {
            var config = TypeAdapterConfig.GlobalSettings;
            // Shop Mappings
            config.NewConfig<CreateShopDto, Shop>()
                .IgnoreNullValues(true);
            config.NewConfig<UpdateShopDto, Shop>()
                .IgnoreNullValues(true);
            config.NewConfig<Shop, UpdateShopDto>();
            
            // New Entities Mappings
            config.NewConfig<Vorder.Application.DTOs.OrderDtos.CreateOrderDto, Order>()
                .IgnoreNullValues(true);
            config.NewConfig<Vorder.Application.DTOs.AddressDtos.CreateAddressDto, Address>()
                .IgnoreNullValues(true);
            config.NewConfig<Vorder.Application.DTOs.PaymentDtos.CreatePaymentDto, Payment>()
                .IgnoreNullValues(true);
            config.NewConfig<Vorder.Application.DTOs.ReviewDtos.CreateReviewDto, Review>()
                .IgnoreNullValues(true);

            services.AddSingleton(config);
        }
    }
}
