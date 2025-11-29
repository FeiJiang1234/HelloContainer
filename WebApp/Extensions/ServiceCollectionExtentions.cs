using HelloContainer.SharedKernel.Options;
using HelloContainer.WebApp.HttpClientHandlers;
using HelloContainer.WebApp.Services;

namespace HelloContainer.WebApp.Extensions
{
    public static class ServiceCollectionExtentions
    {
        public static IServiceCollection ConfigureApiService(this IServiceCollection services, IConfiguration configuration)
        {
            var apiOptions = configuration.GetSection("ApiInfo").Get<ApiOptions>()!;
            
            AddHttpClient<ContainerApiClient>(services, apiOptions.ContainerApiBaseUri!);
            AddHttpClient<UserApiClient>(services, apiOptions.UserApiBaseUri!);

            return services;
        }

        private static void AddHttpClient<TClient>(IServiceCollection services, string baseUri) 
            where TClient : class
        {
            services.AddHttpClient<TClient>(c => c.BaseAddress = new Uri(baseUri))
                .AddHttpMessageHandler(sp => new AuthenticationDelegatingHandler(sp.GetRequiredService<IHttpContextAccessor>()));
        }

        public static IServiceCollection AddContainerIdentity(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOidc(o => configuration.Bind("Oidc", o));
            return services;
        }
    }
}
