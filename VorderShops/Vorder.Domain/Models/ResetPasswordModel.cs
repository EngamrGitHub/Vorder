namespace Vorder.Domain.Models
{
    public record ResetPasswordModel(string Email, string ResetToken, string NewPassword);
}
