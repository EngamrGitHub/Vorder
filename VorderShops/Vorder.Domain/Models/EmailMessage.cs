using MimeKit;

namespace Vorder.Domain.Models
{
    public class EmailMessage
    {
        public EmailMessage(string subject, string content, string to)
        {
            Subject = subject;
            Content = content;
            To = new MailboxAddress("Confirmation Email", to);
        }

        public string Subject { get; set; }
        public string Content { get; set; }
        public MailboxAddress To { get; set; }


    }
}
