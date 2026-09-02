using Mapster;
using Microsoft.EntityFrameworkCore;
using Vorder.Application.DTOs.Shop;
using Vorder.Application.Interfaces.Repositories;
using Vorder.Domain.Entities;

namespace Vorder.Infrastructure.Data.Repositories
{
    public class ShopRepository(ApplicationDbContext context) : GenericRepository<Shop>(context), IShopRepository
    {
        public async Task<Shop> AddShopAsync(CreateShopDto entity, Guid userId)
        {
            Shop shop = entity.Adapt<Shop>();
            shop.Id = Guid.NewGuid();

            shop.OwnerId = userId;
            //shop.IsActive = true;
            //shop.IsDeleted = false;
            //shop.CreationTime = DateTime.Now;
            //shop.CreatorId = userId;

            await _context.Shops.AddAsync(shop);

            // user can have only one shop
            // TODO: We can make the user to have multiple shops in the future 
            var owner = await _context.Users.FindAsync(userId);
            if (owner != null)
            {
                owner.ShopID = shop.Id;
                _context.Users.Update(owner);
            }
            await SaveChangesAsync();
            return shop;
        }

        public async Task<Shop> GetShopByNameAsync(string shopName)
        {
            return await _context.Shops.Where(s => s.Name == shopName).SingleOrDefaultAsync();

        }
    }
}
