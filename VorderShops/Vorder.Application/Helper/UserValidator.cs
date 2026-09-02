using System.Text.RegularExpressions;
using Vorder.Domain.Constants;

namespace Vorder.Application.Helper
{
    public class UserValidator
    {

        public bool ValidateEmail(string email) =>
            Regex.IsMatch(email, RegexConstants.EmailPattern, RegexOptions.IgnoreCase);


        public bool ValidatePhoneNumber(string phone) =>
            Regex.IsMatch(phone, RegexConstants.EgyptianPhoneNumberPattern);
    }
}
