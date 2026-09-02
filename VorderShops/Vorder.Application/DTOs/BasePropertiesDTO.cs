namespace Vorder.Application.DTOs
{
    public class BasePropertiesDTO
    {
        public Guid Id { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public Guid? CreatorId { get; set; }
        public Guid? LastModifierId { get; set; }
    }
}
