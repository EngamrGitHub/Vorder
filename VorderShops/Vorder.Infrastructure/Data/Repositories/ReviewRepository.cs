using Vorder.Application.Interfaces.Repositories;
using Vorder.Domain.Entities;

namespace Vorder.Infrastructure.Data.Repositories
{
    public class ReviewRepository(ApplicationDbContext context) : GenericRepository<Review>(context), IReviewRepository
    {
    }
}
