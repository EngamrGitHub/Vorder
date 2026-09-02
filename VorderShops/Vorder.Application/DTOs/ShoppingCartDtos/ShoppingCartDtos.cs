namespace Vorder.Application.DTOs.ShoppingCartDtos
{
    public class AddToCartDto
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class ResponseCartItemDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
