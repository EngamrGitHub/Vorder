using Microsoft.EntityFrameworkCore;
using Vorder.Application.Interfaces.Repositories;
using Vorder.Domain.Entities;

namespace Vorder.Infrastructure.Data.Repositories
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
    {
        protected readonly ApplicationDbContext _context;
        private DbSet<TEntity> _entities;

        public GenericRepository(ApplicationDbContext context)
        {
            _context = context;
            _entities = context.Set<TEntity>();
        }


        public async Task<TEntity> GetByIdAsync(Guid id)
        {
            return await _entities.FindAsync(id);
        }

        public virtual async Task<IEnumerable<TEntity>> GetAllAsync(Guid? ShopID)
        {
            if (typeof(TEntity) == typeof(Shop))
            {
                return await _entities.ToListAsync();
            }
            else
            {
                return await _entities.Where(e => EF.Property<Guid>(e, "ShopID") == ShopID).ToListAsync();
            }
        }

        public async Task<IEnumerable<TEntity>> FindAllAsync(System.Linq.Expressions.Expression<System.Func<TEntity, bool>> predicate)
        {
            return await _entities.Where(predicate).ToListAsync();
        }

        public virtual async Task AddAsync(TEntity entity)
        {
            await _entities.AddAsync(entity);
        }

        public void Update(TEntity entity)
        {
            _entities.Update(entity);
        }

        public void Delete(TEntity entity)
        {
            // Check if the entity supports soft delete
            var prop = typeof(TEntity).GetProperty("IsDeleted");
            if (prop != null)
            {
                prop.SetValue(entity, true);

                //var lastModifiedProp = typeof(TEntity).GetProperty("LastModificationTime");
                //lastModifiedProp.SetValue(entity, DateTime.Now);

                _entities.Update(entity);
            }
            else
            {
                // Fallback: hard delete if entity doesn’t have IsDeleted
                _entities.Remove(entity);
            }
        }
        public virtual async Task<IEnumerable<TEntity>> GetPagedAsync(int pageNumber, int pageSize, Guid? shopID)
        {
            if (typeof(TEntity) == typeof(Shop))
            {
                var items = await _entities
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
                return items;
            }
            else
            {
                var items = await _entities.Where(e => EF.Property<Guid>(e, "ShopID") == shopID)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
                return items;
            }
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

    }
}
