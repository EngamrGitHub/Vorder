using System.ComponentModel.DataAnnotations.Schema;
using Vorder.Infrastructure.Data;

namespace Vorder.Domain.Entities
{
    public class Address : BaseProperties
    {
        public required string AddressType { get; set; } // e.g., Billing, Shipping
        public required string AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public required string City { get; set; }
        public string? Province { get; set; }
        public required string Country { get; set; }
        public string? PostalCode { get; set; }

        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public ApplicationUser User { get; set; }
    }
}
