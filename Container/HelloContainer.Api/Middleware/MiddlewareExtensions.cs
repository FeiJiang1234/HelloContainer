using HelloContainer.Api.OPA;
using HelloContainer.Application.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace HelloContainer.Api.Middleware
{
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UseDomainExceptionHandler(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<DomainExceptionHandlerMiddleware>();
        }

        public static IServiceCollection AddOpaPolicyAuthorization(this IServiceCollection services)
        {
            return services.AddScoped<IAuthorizationHandler>(sp => new OpaPolicyHandler(
                    sp.GetRequiredService<IUserRoleRetriever>(),
                    sp.GetRequiredService<IOptions<JsonSerializerOptions>>(),
                    sp.GetRequiredService<IHttpClientFactory>())
                );
        }

    }
} 