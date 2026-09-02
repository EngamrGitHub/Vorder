using Vorder.Domain.Entities;

namespace Vorder.Domain.Entities
{
    public class Membership : BaseProperties
    {
        public required string MembershipType { get; set; } // e.g., Silver, Gold, Platinum
    }
}
