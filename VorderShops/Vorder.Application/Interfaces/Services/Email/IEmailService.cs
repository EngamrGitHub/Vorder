using Vorder.Domain.Models;

namespace Vorder.Application.Interfaces.Services.Email
{
    public interface IEmailService
    {
        Task SendEmail(EmailMessage message, string EmailType);
    }
}
