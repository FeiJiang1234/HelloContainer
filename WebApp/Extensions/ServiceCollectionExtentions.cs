namespace HelloContainer.WebApp.Extensions
{
    public static class ServiceCollectionExtentions
    {
        public static IServiceCollection AddContainerIdentity(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOidc(o =>
            {
                configuration.Bind("Oidc", o);
            });

            return services;
        }

    }
}
