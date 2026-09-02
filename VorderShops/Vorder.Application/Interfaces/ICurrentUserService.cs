namespace Vorder.Application.Interfaces
{
    public interface ICurrentUserService
    {
        Guid? UserId { get; }
        Guid GetTenantId();
    }
}
