namespace Vorder.Application.DTOs.CategoryDtos
{
    public class ResponseCategoryDto : BasePropertiesDTO
    {
        public required string Name { get; set; }
        public string? NameAr { get; set; }
        public string? Description { get; set; }
        public string? DescriptionAr { get; set; }
        public bool AppearsInHeader { get; set; }

        // Display & Organization
        public string? IconUrl { get; set; }  // Icon/image for the category
        public string? ImageUrl { get; set; }  // Banner/cover image
        public string? Color { get; set; }  // Hex color for UI: "#FF5733"

        // Status & Metadata
        public bool IsFeatured { get; set; } = false;  // Show on homepage
        public string? MetaTitle { get; set; }  // SEO
        public string? MetaDescription { get; set; }  // SEO
        public string? MetaKeywords { get; set; }  // SEO
    }
}
