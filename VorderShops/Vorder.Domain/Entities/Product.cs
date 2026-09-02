using System.ComponentModel.DataAnnotations.Schema;

namespace Vorder.Domain.Entities
{
    public class Product : BaseProperties
    {
        public string Name { get; set; }
        public string Description { get; set; }


        [Column(TypeName = "decimal(12,2)")]
        public decimal Price { get; set; }
        public bool ApplyDiscount { get; set; }

        [Column(TypeName = "decimal(12,2)")]
        public decimal DiscountPercent { get; set; }

        [Column(TypeName = "decimal(12,2)")]
        public decimal DiscountPrice { get; set; }
        public int StockQuantity { get; set; }
        public string SKU { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string ImageUrl { get; set; }
        public bool isPhysical { get; set; } // Indicates if the product is a physical item or a digital one


        [ForeignKey("SubCategory")]
        public Guid SubCategoryId { get; set; }

        public SubCategory SubCategory { get; set; }

        [ForeignKey("Department")]
        public Guid? DepartmentId { get; set; }
        public Department? Department { get; set; }

    }
}
