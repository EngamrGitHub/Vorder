using Vorder.Application.Interfaces.Repositories;
using Vorder.Domain.Entities;

namespace Vorder.Infrastructure.Data.Repositories
{
    public class PaymentRepository(ApplicationDbContext context) : GenericRepository<Payment>(context), IPaymentRepository
    {
    }
}
