using Microsoft.EntityFrameworkCore;
using Vorder.Application.Interfaces.Repositories;
using Vorder.Domain.Entities;

namespace Vorder.Infrastructure.Data.Repositories
{
    public class SubCategoryRepository(ApplicationDbContext context) : GenericRepository<SubCategory>(context), ISubCategoryRepository
    {
        // SubCategory has no direct ShopID — it belongs to a Shop via Category.ShopID
        public override async Task<IEnumerable<SubCategory>> GetAllAsync(Guid? shopID)
        {
            if (shopID == null)
                return await _context.SubCategories.ToListAsync();

            return await _context.SubCategories
                .Include(sc => sc.Category)
                .Where(sc => sc.Category != null && sc.Category.ShopID == shopID)
                .ToListAsync();
        }

        public override async Task<IEnumerable<SubCategory>> GetPagedAsync(int pageNumber, int pageSize, Guid? shopID)
        {
            if (shopID == null)
                return await _context.SubCategories.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return await _context.SubCategories
                .Include(sc => sc.Category)
                .Where(sc => sc.Category != null && sc.Category.ShopID == shopID)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<List<SubCategory>> GetByCategoryID(Guid CategoryID)
            => await _context.SubCategories.Where(x => x.CategoryId == CategoryID).ToListAsync();
    }
}
