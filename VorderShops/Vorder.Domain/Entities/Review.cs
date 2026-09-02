using System.ComponentModel.DataAnnotations.Schema;
using Vorder.Infrastructure.Data;

namespace Vorder.Domain.Entities
{
    public class Review : BaseProperties
    {
        public string? CustomerReview { get; set; }
        public int Rating { get; set; } // 1-5

        [ForeignKey("Product")]
        public Guid ProductId { get; set; }
        public Product Product { get; set; }

        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public ApplicationUser User { get; set; }
    }
}
