namespace Vorder.Domain.Models
{
    public class ConfirmEmailModel
    {
        public Guid UserID { get; set; }
        public string ConfirmationToken { get; set; } = string.Empty;
    }
}
