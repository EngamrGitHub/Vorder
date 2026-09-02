using System.ComponentModel.DataAnnotations.Schema;
using Vorder.Infrastructure.Data;

namespace Vorder.Domain.Entities
{
    public class BaseProperties
    {
        public Guid Id { get; set; }
        public bool IsDeleted { get; set; } // soft delete flag
        public bool IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }


        [ForeignKey("Creator")]
        public Guid? CreatorId { get; set; }

        [ForeignKey("LastModifier")]
        public Guid? LastModifierId { get; set; }


        public ApplicationUser Creator { get; set; }
        public ApplicationUser LastModifier { get; set; }
    }
}
