using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Vorder.Application.Interfaces;

namespace Vorder.Infrastructure.Services
{
    public class CurrentUserService(IHttpContextAccessor _httpContextAccessor) : ICurrentUserService
    {
        public Guid? UserId =>
            Guid.TryParse(
                _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier),
                out var userId)
                ? userId
                : (Guid?)null;

        public Guid GetTenantId()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
                throw new UnauthorizedAccessException("No HTTP context available.");

            // 1. Try to get it from JWT claims (for authenticated shop owners/admins)
            string? tenantIdValue = httpContext.User?.FindFirstValue("TenantID");

            // 2. Try to get it from request headers (case-insensitive checks for common headers)
            if (string.IsNullOrWhiteSpace(tenantIdValue))
            {
                if (httpContext.Request.Headers.TryGetValue("X-Shop-ID", out var xShopId))
                {
                    tenantIdValue = xShopId.ToString();
                }
                else if (httpContext.Request.Headers.TryGetValue("TenantID", out var tenantIdHeader))
                {
                    tenantIdValue = tenantIdHeader.ToString();
                }
                else if (httpContext.Request.Headers.TryGetValue("ShopId", out var shopIdHeader))
                {
                    tenantIdValue = shopIdHeader.ToString();
                }
            }

            // 3. Try to get it from query parameters (for ease of testing and public links)
            if (string.IsNullOrWhiteSpace(tenantIdValue))
            {
                if (httpContext.Request.Query.TryGetValue("shopId", out var shopIdQuery))
                {
                    tenantIdValue = shopIdQuery.ToString();
                }
                else if (httpContext.Request.Query.TryGetValue("tenantId", out var tenantIdQuery))
                {
                    tenantIdValue = tenantIdQuery.ToString();
                }
            }

            if (string.IsNullOrWhiteSpace(tenantIdValue) || !Guid.TryParse(tenantIdValue, out Guid tenantId))
                throw new UnauthorizedAccessException("Invalid or missing TenantID claim, header, or query parameter.");

            return tenantId;
        }
    }

}
