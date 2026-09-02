namespace Vorder.Application.Interfaces.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T> GetByIdAsync(Guid id);
        Task<IEnumerable<T>> GetAllAsync(Guid? ShopID);
        Task<IEnumerable<T>> FindAllAsync(System.Linq.Expressions.Expression<System.Func<T, bool>> predicate);
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task SaveChangesAsync();
        Task<IEnumerable<T>> GetPagedAsync(int pageNumber, int pageSize, Guid? shopID);
    }
}
