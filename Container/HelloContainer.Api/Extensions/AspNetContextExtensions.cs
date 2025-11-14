using HelloContainer.Api.Middleware;
using HelloContainer.Application.ContextAccessor;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace HelloContainer.Api.Extensions
{
    public static class AspNetContextExtensions
    {
        public static IApplicationBuilder UseAspNetContext<T>(this IApplicationBuilder builder) where T : class
        {
            return builder.UseMiddleware<AspNetContextMiddleware<T>>();
        }

        public static IServiceCollection AddAspNetContext<T>(this IServiceCollection services,
                Func<HttpContext, (bool succeeded, T? context)> ctxCreator) where T : class
        {
            Func<HttpContext, (bool succeeded, T? context)> ctxCreator2 = ctxCreator;
            services.TryAddSingleton((_) => new AspNetContextAccessor<T>(ctxCreator2));
            return services
                .AddSingleton((Func<IServiceProvider, IContextAccessor<T>>)((sp) => sp.GetRequiredService<AspNetContextAccessor<T>>()));
        }
    }
}
