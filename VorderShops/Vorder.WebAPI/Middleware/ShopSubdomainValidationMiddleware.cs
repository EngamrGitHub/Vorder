public class ShopSubdomainValidationMiddleware
{
    private readonly RequestDelegate _next;

    public ShopSubdomainValidationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var subdomain = SubdomainHelper.GetSubdomain(context.Request);
        var shopNameClaim = context.User.FindFirst("shop_name")?.Value;

        if (!string.IsNullOrEmpty(subdomain) && !string.IsNullOrEmpty(shopNameClaim))
        {
            if (!string.Equals(subdomain, shopNameClaim, StringComparison.OrdinalIgnoreCase))
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsync("Shop name does not match subdomain.");
                return;
            }
        }

        await _next(context);
    }
}