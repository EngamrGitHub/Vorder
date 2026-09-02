namespace Vorder.Application.ResultPattern
{
    public static class Errors
    {
        public static ApplicationError Unauthorized(string errorMsg, string errorCode)
        {
            return new ApplicationError(errorMsg, errorCode);
        }

        public static ApplicationError NotFound(string errorMsg, string errorCode)
        {
            return new ApplicationError(errorMsg, errorCode);
        }

        public static ApplicationError ServerError(string errorMsg = ErrorConstants.SERVERERROR, string errorCode = ErrorConstants.SERVERERRORCODE)
        {
            return new ApplicationError(errorMsg, errorCode);
        }

        public static ApplicationError Exists(string errorMsg, string errorCode)
        {
            return new ApplicationError(errorMsg, errorCode);
        }
        public static ApplicationError ValidationError(string errorMsg = ErrorConstants.VALIDATIONERROR, string errorCode = ErrorConstants.VALIDATIONERRORCODE)
        {
            return new ApplicationError(errorMsg, errorCode);
        }
        public static ApplicationError Forbidden(string errorMsg = ErrorConstants.VALIDATIONERROR, string errorCode = ErrorConstants.VALIDATIONERRORCODE)
        {
            return new ApplicationError(errorMsg, errorCode);
        }
    }
}
