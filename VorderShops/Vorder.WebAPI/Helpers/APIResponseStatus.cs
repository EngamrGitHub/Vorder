using Microsoft.AspNetCore.Mvc;
using Vorder.Application.ResultPattern;

namespace Vorder.WebAPI.Helpers
{
    public static class ApiResponseStatus
    {
        public static ActionResult<ApplicationResult<T>> Ok<T>(ApplicationResult<T> result) where T : class
            => new ObjectResult(result) { StatusCode = StatusCodes.Status200OK };

        public static ActionResult<ApplicationResult<T>> BadRequest<T>(ApplicationResult<T> result) where T : class
            => new ObjectResult(result) { StatusCode = StatusCodes.Status400BadRequest };

        public static ActionResult<ApplicationResult<T>> Forbidden<T>(ApplicationResult<T> result) where T : class
            => new ObjectResult(result) { StatusCode = StatusCodes.Status403Forbidden };

        public static ActionResult<ApplicationResult<T>> NotFound<T>(ApplicationResult<T> result) where T : class
            => new ObjectResult(result) { StatusCode = StatusCodes.Status404NotFound };
        public static ActionResult<ApplicationResult<T>> Unauthorized<T>(ApplicationResult<T> result) where T : class
            => new ObjectResult(result) { StatusCode = StatusCodes.Status401Unauthorized };

        public static ActionResult<ApplicationResult<T>> Created<T>(ApplicationResult<T> result) where T : class
            => new ObjectResult(result) { StatusCode = StatusCodes.Status201Created };
    }
}
