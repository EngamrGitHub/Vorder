using System.ComponentModel.DataAnnotations.Schema;
using Vorder.Infrastructure.Data;

namespace Vorder.Domain.Entities
{
    public class Wishlist : BaseProperties
    {
        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public ApplicationUser User { get; set; }

        [ForeignKey("Product")]
        public Guid ProductId { get; set; }
        public Product Product { get; set; }
    }
}
