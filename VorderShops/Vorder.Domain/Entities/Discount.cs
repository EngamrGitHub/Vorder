using System.ComponentModel.DataAnnotations.Schema;
using Vorder.Domain.Entities;

namespace Vorder.Domain.Entities
{
    public class Discount : BaseProperties
    {
        [Column(TypeName = "decimal(5,2)")]
        public decimal DiscountPercent { get; set; }

        public ICollection<Offer> Offers { get; set; } = new List<Offer>();
    }
}
