using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Vorder.Application
{
    public static class DependencyInjection
    {

        public static void AddApplicationServices(this IServiceCollection services)
        {
            services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly, includeInternalTypes: true);
            services.AddHttpContextAccessor();
        }
    }
}
