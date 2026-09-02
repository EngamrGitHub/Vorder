namespace Vorder.Domain.Models
{
    public class JwtTokenModel
    {
        public string Token { get; set; }
        public int TokenExpiryHours { get; set; }
        public DateTime TokenExpiration { get; set; }
        public string RefreshToken { get; set; }
        public int RefreshTokenExpiryHours { get; set; }
        public DateTime RefreshTokenExpiration { get; set; }
        public string TokenType { get; set; } = "Bearer";
    }
}
