using System.ComponentModel.DataAnnotations.Schema;

namespace Vorder.Domain.Entities
{
    public class SubCategory : BaseProperties
    {
        public string Name { get; set; }
        public string? NameAr { get; set; }
        public string? Description { get; set; }
        public string? DescriptionAr { get; set; }

        // Display & Organization
        public string? IconUrl { get; set; }
        public string? ImageUrl { get; set; }
        public string? Color { get; set; }

        // Status & Metadata
        public bool IsFeatured { get; set; } = false;
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }


        [ForeignKey("Category")]
        public Guid CategoryId { get; set; }
        public Category? Category { get; set; }

    }
}
