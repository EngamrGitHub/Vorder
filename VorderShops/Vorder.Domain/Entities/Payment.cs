using System.ComponentModel.DataAnnotations.Schema;
using Vorder.Domain.Entities;

namespace Vorder.Domain.Entities
{
    public class Payment : BaseProperties
    {
        [Column(TypeName = "decimal(12,2)")]
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public string PaymentMethod { get; set; } // e.g., CreditCard, PayPal, Cash
        public string Status { get; set; } // e.g., Pending, Completed, Failed

        [ForeignKey("Order")]
        public Guid OrderId { get; set; }
        public Order Order { get; set; }

        // Additional fields for CreditCard/GiftCard can be added here or as JSON/Separate properties
        public string? TransactionId { get; set; }
    }
}
