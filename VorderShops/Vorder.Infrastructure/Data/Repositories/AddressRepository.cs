using Vorder.Application.Interfaces.Repositories;
using Vorder.Domain.Entities;

namespace Vorder.Infrastructure.Data.Repositories
{
    public class AddressRepository(ApplicationDbContext context) : GenericRepository<Address>(context), IAddressRepository
    {
    }
}
