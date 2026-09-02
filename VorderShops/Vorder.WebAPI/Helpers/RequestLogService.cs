using System.Text;
using Vorder.Domain.Entities;
using Vorder.Infrastructure.Data;

namespace Vorder.WebAPI.Helpers
{
    public class RequestLogService
    {
        public static async Task LogRequest(ApplicationDbContext dbContext, HttpRequest request, int statusCode, string errMsg)
        {

            var path = request.Path.ToString();

            var requestLog = new RequestLog
            {
                Path = path,
                Method = request.Method,
                RequestTime = DateTime.UtcNow.AddHours(3)
            };
            using (var reader = new StreamReader(request.Body, Encoding.UTF8, leaveOpen: true))
            {
                string body = await reader.ReadToEndAsync();

                requestLog.RequestBody = body;
            }

            requestLog.StatusCode = statusCode;
            requestLog.ErrorMessage = errMsg;

            await dbContext.RequestLogs.AddAsync(requestLog);
            await dbContext.SaveChangesAsync();
        }

    }
}
