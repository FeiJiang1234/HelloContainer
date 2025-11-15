using HelloContainer.WebApp.HttpClientHandlers;
using HelloContainer.WebApp.Options;
using HelloContainer.WebApp.Services;

namespace HelloContainer.WebApp.Extensions
{
    public static class ServiceCollectionExtentions
    {
        public static IServiceCollection ConfigureApiService(this IServiceCollection services, IConfiguration configuration)
        {
            var apiOptions = configuration.GetSection("ApiInfo").Get<ApiOptions>()!;
            services.AddHttpClient<ContainerApiClient>(client =>
            {
                client.BaseAddress = new Uri(apiOptions.ContainerApiBaseUri!);
            }).AddHttpMessageHandler(sp => new HttpClientHandlers.HttpClientHandler(sp.GetRequiredService<IHttpContextAccessor>()));

            services.AddHttpClient<UserApiClient>(client =>
            {
                client.BaseAddress = new Uri(apiOptions.UserApiBaseUri!);
            });

            return services;
        }

        public static IServiceCollection AddContainerIdentity(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOidc(o => configuration.Bind("Oidc", o));
            return services;
        }
    }
}
