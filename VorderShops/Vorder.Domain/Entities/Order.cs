using System.ComponentModel.DataAnnotations.Schema;
using Vorder.Infrastructure.Data;

namespace Vorder.Domain.Entities
{
    public class Order : BaseProperties
    {
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public DateTime? RequiredDate { get; set; }
        public DateTime? ShippedDate { get; set; }

        [Column(TypeName = "decimal(12,2)")]
        public decimal Freight { get; set; }

        [Column(TypeName = "decimal(12,2)")]
        public decimal SalesTax { get; set; }

        [Column(TypeName = "decimal(12,2)")]
        public decimal TotalAmount { get; set; }

        // Shipping Address Snapshot
        public required string ShippingAddressLine { get; set; }
        public required string ShippingCity { get; set; }
        public string? ShippingProvince { get; set; }
        public required string ShippingCountry { get; set; }
        public string? ShippingPostalCode { get; set; }

        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public ApplicationUser User { get; set; }

        [ForeignKey("Shipper")]
        public Guid? ShipperId { get; set; }
        public Shipper? Shipper { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
