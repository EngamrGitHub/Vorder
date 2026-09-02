using Vorder.Application.Interfaces.Repositories;
using Vorder.Domain.Entities;

namespace Vorder.Infrastructure.Data.Repositories
{
    public class CategoryRepository(ApplicationDbContext context) : GenericRepository<Category>(context), ICategoryRepository
    {
    }
}
