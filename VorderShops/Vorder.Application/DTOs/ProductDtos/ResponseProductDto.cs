namespace Vorder.Application.DTOs.ProductDtos
{
    public class ResponseProductDto : BasePropertiesDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool ApplyDiscount { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal DiscountPrice { get; set; }
        public int StockQuantity { get; set; }
        public string SKU { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string ImageUrl { get; set; }
        public bool isPhysical { get; set; } // Indicates if the product is a physical item or a digital one

        public Guid ShopID { get; set; }
        public Guid CategoryId { get; set; }
        public Guid SubCategoryId { get; set; }
    }
}
