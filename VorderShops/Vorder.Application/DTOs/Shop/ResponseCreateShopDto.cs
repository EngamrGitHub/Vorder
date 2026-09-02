namespace Vorder.Application.DTOs.Shop
{
    public class ResponseCreateShopDto
    {
        public ResponseShopDto Shop { get; set; } = null!;
        public string Token { get; set; } = null!;
    }
}
