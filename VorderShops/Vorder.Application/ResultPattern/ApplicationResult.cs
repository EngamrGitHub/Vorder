namespace Vorder.Application.ResultPattern
{
    public class ApplicationResult<T> where T : class
    {
        // TODO : Make The ErrorMsg a list of strings to hold multiple error messages
        public string? ErrorMsg { get; private set; }
        public string? ErrorCode { get; private set; }
        public bool IsSuccess { get; private set; }
        public T? Result { get; private set; }

        public ApplicationResult(ApplicationError error)
        {
            ErrorMsg = error.ErrorMsg;
            ErrorCode = error.ErrorCode;
            IsSuccess = false;
        }
        public ApplicationResult(T value)
        {
            IsSuccess = true;
            Result = value;
        }

        public static implicit operator ApplicationResult<T>(T value) { return new ApplicationResult<T>(value); }
        public static implicit operator ApplicationResult<T>(ApplicationError error) { return new ApplicationResult<T>(error); }
    }
}
