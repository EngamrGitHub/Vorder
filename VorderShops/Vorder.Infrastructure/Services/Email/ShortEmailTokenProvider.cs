namespace Vorder.Infrastructure.Services.Email
{
    public static class ShortEmailTokenProvider
    {

        public static string GenerateShortToken()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        public static bool ValidateShortToken(string token)
        {
            return token.Length == 6 && token.All(char.IsDigit);
        }
    }
}
