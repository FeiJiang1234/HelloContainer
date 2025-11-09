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
            }).AddHttpMessageHandler(sp => new BaseHttpClientHandler(sp.GetRequiredService<IHttpContextAccessor>()));

            return services;
        }

        public static IServiceCollection AddContainerIdentity(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOidc(o => configuration.Bind("Oidc", o));
            return services;
        }
    }
}
