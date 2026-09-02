namespace Vorder.Application.DTOs.OrderDtos
{
    public class CreateOrderDto
    {
        public List<CreateOrderItemDto> Items { get; set; } = [];
        
        // Shipping details
        public required string ShippingAddressLine { get; set; }
        public required string ShippingCity { get; set; }
        public string? ShippingProvince { get; set; }
        public required string ShippingCountry { get; set; }
        public string? ShippingPostalCode { get; set; }
    }

    public class CreateOrderItemDto
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class ResponseOrderDto
    {
        public Guid Id { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        
        public List<ResponseOrderItemDto> Items { get; set; } = [];
        
        public string ShippingAddressLine { get; set; }
        public string ShippingCity { get; set; }
        public string ShippingCountry { get; set; }
    }

    public class ResponseOrderItemDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
