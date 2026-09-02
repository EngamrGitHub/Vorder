namespace Vorder.Domain.Constants
{
    public static class RegexConstants
    {
        public const string EgyptianPhoneNumberPattern = @"^01[0125]\d{8}$";
        public const string EmailPattern = @"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$";
    }
}
