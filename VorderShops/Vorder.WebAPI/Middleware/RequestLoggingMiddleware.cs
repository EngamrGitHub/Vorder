using System.Text.Json;
using Vorder.Application.ResultPattern;
using Vorder.Infrastructure.Data;
using Vorder.WebAPI.Helpers;

namespace Vorder.WebAPI.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ApplicationDbContext _dbContext)
        {
            try
            {
                await _next(context);

            }
            catch (Exception ex)
            {
                await RequestLogService.LogRequest(_dbContext, context.Request, 500, ex.Message);
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "application/json";

                ApplicationResult<string> result = new(Errors.ServerError(errorMsg: ex.Message + " " + ex.InnerException));

                var responseJson = JsonSerializer.Serialize(result);

                await context.Response.WriteAsync(responseJson);
            }
        }
    }
}
