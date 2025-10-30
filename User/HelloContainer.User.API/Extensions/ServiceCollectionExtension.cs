using Todo.Application;
using Todo.Domain.Abstractions;
using Todo.Infrastructure;
using Todo.Infrastructure.Repositories;

namespace HelloContainer.User.API.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddUserServices(this IServiceCollection services)
        {
            services.AddScoped<UserService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            return services;
        }
    }
}
