using Vorder.Domain.Entities;

namespace Vorder.Domain.Entities
{
    public class Department : BaseProperties
    {
        public required string Name { get; set; }
        public string? Description { get; set; }

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
