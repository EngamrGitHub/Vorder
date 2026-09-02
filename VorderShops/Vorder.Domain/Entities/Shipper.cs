using Vorder.Domain.Entities;

namespace Vorder.Domain.Entities
{
    public class Shipper : BaseProperties
    {
        public required string Name { get; set; }
        public string? Email { get; set; }

        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
