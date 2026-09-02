using Vorder.Application.DTOs.Shop;
using Vorder.Domain.Entities;

namespace Vorder.Application.Interfaces.Repositories
{
    public interface IShopRepository : IGenericRepository<Shop>
    {
        Task<Shop> AddShopAsync(CreateShopDto entity, Guid userID);
        Task<Shop> GetShopByNameAsync(string shopName);
    }
}
