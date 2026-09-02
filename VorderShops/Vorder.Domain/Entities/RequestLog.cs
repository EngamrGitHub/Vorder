using System.ComponentModel.DataAnnotations;

namespace Vorder.Domain.Entities
{
    public class RequestLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Path { get; set; } = string.Empty;

        public string ErrorMessage { get; set; } = string.Empty;

        public string RequestBody { get; set; } = string.Empty;

        [Required]
        public string Method { get; set; } = string.Empty;

        public int? StatusCode { get; set; }

        public DateTime RequestTime { get; set; } = DateTime.UtcNow;

    }
}
