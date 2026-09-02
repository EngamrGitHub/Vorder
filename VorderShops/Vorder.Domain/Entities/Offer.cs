using System.ComponentModel.DataAnnotations.Schema;
using Vorder.Domain.Entities;

namespace Vorder.Domain.Entities
{
    public class Offer : BaseProperties
    {
        [ForeignKey("Product")]
        public Guid ProductId { get; set; }
        public Product Product { get; set; }

        [ForeignKey("Discount")]
        public Guid DiscountId { get; set; }
        public Discount Discount { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
