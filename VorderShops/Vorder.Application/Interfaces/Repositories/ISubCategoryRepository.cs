using Vorder.Domain.Entities;

namespace Vorder.Application.Interfaces.Repositories
{
    public interface ISubCategoryRepository : IGenericRepository<SubCategory>
    {
        Task<List<SubCategory>> GetByCategoryID(Guid CategoryID);
    }
}
