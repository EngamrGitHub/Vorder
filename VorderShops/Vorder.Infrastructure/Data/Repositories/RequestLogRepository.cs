using Vorder.Application.Interfaces.Repositories;
using Vorder.Domain.Entities;

namespace Vorder.Infrastructure.Data.Repositories
{
    public class RequestLogRepository : GenericRepository<RequestLog>, IRequestLogRepository
    {
        public RequestLogRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
