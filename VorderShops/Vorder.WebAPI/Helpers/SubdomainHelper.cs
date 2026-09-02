using Microsoft.AspNetCore.Identity;
using Vorder.Infrastructure.Data;

public static class SubdomainHelper
{
    public static string? GetSubdomain(HttpRequest request)
    {
        var host = request.Host.Host;
        var parts = host.Split('.');
        if (parts.Length > 2)
        {
            return parts[0]; // Assuming subdomain.domain.tld
        }
        return null;
    }

    public static async Task<string> GetUsernameByID(Guid id,UserManager<ApplicationUser> _userManager)
    {
        ApplicationUser? user = await _userManager.FindByIdAsync(id.ToString());
        string userName = user != null ? user.UserName! : "Unknown";
        return userName;
    }
}