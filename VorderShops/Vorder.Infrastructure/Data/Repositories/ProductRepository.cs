using Microsoft.EntityFrameworkCore;
using Vorder.Application.Interfaces.Repositories;
using Vorder.Domain.Entities;

namespace Vorder.Infrastructure.Data.Repositories
{
    public class ProductRepository(ApplicationDbContext context) : GenericRepository<Product>(context), IProductRepository
    {
        // Product has no direct ShopID — it belongs to a Shop via SubCategory → Category → ShopID
        public override async Task<IEnumerable<Product>> GetAllAsync(Guid? shopID)
        {
            if (shopID == null)
                return await _context.Products.ToListAsync();

            return await _context.Products
                .Include(p => p.SubCategory)
                    .ThenInclude(sc => sc.Category)
                .Where(p => p.SubCategory != null
                         && p.SubCategory.Category != null
                         && p.SubCategory.Category.ShopID == shopID)
                .ToListAsync();
        }

        public override async Task<IEnumerable<Product>> GetPagedAsync(int pageNumber, int pageSize, Guid? shopID)
        {
            if (shopID == null)
                return await _context.Products.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return await _context.Products
                .Include(p => p.SubCategory)
                    .ThenInclude(sc => sc.Category)
                .Where(p => p.SubCategory != null
                         && p.SubCategory.Category != null
                         && p.SubCategory.Category.ShopID == shopID)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
    }
}
