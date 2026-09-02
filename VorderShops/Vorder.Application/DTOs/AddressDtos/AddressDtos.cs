namespace Vorder.Application.DTOs.AddressDtos
{
    public class CreateAddressDto
    {
        public required string AddressType { get; set; }
        public required string AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public required string City { get; set; }
        public string? Province { get; set; }
        public required string Country { get; set; }
        public string? PostalCode { get; set; }
    }

    public class ResponseAddressDto
    {
        public Guid Id { get; set; }
        public string AddressType { get; set; }
        public string AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string City { get; set; }
        public string? Province { get; set; }
        public string Country { get; set; }
        public string? PostalCode { get; set; }
    }
}
