using System.ComponentModel.DataAnnotations.Schema;
using Vorder.Domain.Entities;

namespace Vorder.Domain.Entities
{
    public class OrderItem : BaseProperties
    {
        [ForeignKey("Order")]
        public Guid OrderId { get; set; }
        public Order Order { get; set; }

        [ForeignKey("Product")]
        public Guid ProductId { get; set; }
        public Product Product { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(12,2)")]
        public decimal UnitPriceSnapshot { get; set; } // Historical price at time of order
    }
}
