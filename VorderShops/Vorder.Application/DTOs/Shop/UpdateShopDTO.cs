using Microsoft.AspNetCore.Http;

namespace Vorder.Application.DTOs.Shop
{
    public class UpdateShopDto
    {
        public string? Theme { get; set; }
        public string? Name { get; set; }
        public string? NameAr { get; set; }
        public string? Slug { get; set; }
        public string? Description { get; set; }
        public string? DescriptionAr { get; set; }

        // CONTACT INFORMATION
        public string? WhatsAppNumber { get; set; }
        public string? Website { get; set; }

        // ADDRESS & LOCATION
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; } = "Egypt";
        public string? PostalCode { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        // BRANDING & MEDIA
        public string? LogoUrl { get; set; }
        public IFormFile? Logo { get; set; }
        public string? BannerUrl { get; set; }
        public IFormFile? Banner { get; set; }
        public string? FaviconUrl { get; set; }
        public IFormFile? Favicon { get; set; }
        public string? PrimaryColor { get; set; }
        public string? SecondaryColor { get; set; }

        // BUSINESS INFORMATION
        public string? CommercialRegistrationNumber { get; set; }
        public string? TaxRegistrationNumber { get; set; }  // Tax ID
        public string? LicenseNumber { get; set; }
        public DateTime? EstablishedDate { get; set; }

        // SOCIAL MEDIA LINKS
        public string? FacebookUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public string? TwitterUrl { get; set; }
        public string? TikTokUrl { get; set; }
        public string? LinkedInUrl { get; set; }
        public string? YouTubeUrl { get; set; }

        // SEO & METADATA
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
    }
}
