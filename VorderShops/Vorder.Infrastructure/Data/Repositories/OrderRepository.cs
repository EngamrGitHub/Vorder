using Vorder.Application.Interfaces.Repositories;
using Vorder.Domain.Entities;

namespace Vorder.Infrastructure.Data.Repositories
{
    public class OrderRepository(ApplicationDbContext context) : GenericRepository<Order>(context), IOrderRepository
    {
    }
}
