using Microsoft.AspNetCore.Http;

namespace Vorder.Application.DTOs.ProductDtos
{
    public class UpdateProductDto
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
        public IFormFile? Image { get; set; }
        public bool isPhysical { get; set; }

        public Guid? ShopID { get; set; }
        public Guid? CategoryId { get; set; }
        public Guid? SubCategoryId { get; set; }
    }
}
