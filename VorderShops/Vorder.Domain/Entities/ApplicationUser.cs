using Microsoft.AspNetCore.Identity;
using Vorder.Domain.Entities;

namespace Vorder.Infrastructure.Data
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string FullName { get; set; } = string.Empty;
        public string? CompanyName { get; set; }
        
        public Guid? MembershipId { get; set; }
        public Membership? Membership { get; set; }

        public Guid? ShopID { get; set; }
        public Shop? Shop { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
    }
}
