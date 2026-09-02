namespace Vorder.Application.DTOs.Authentication
{
    public record UserDto(Guid Id, string FullName, string UserName, string Email, string PhoneNumber);
}
