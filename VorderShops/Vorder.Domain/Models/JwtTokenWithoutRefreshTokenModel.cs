namespace Vorder.Domain.Models
{
    public class JwtTokenWithoutRefreshTokenModel
    {
        public string Token { get; set; }
        public int ExpiryHours { get; set; }
        public DateTime Expiration { get; set; }
    }
}
