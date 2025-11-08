using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace HelloContainer.WebApp.Extensions
{
    public static class ServiceCollectionExtentions
    {
        public static IServiceCollection AddContainerIdentity(this IServiceCollection services, IConfiguration configuration)
        {
            var authority = "https://logintest.veracity.com/tfp/ed815121-cdfa-4097-b524-e2b23cd36eb6/B2C_1A_SignInWithADFSIdp/v2.0";
            var clientId = "566af909-a1be-4bb9-86d7-89cec0d72736";
            var clientSecret = "";
            var scope = "https://dnvglb2ctest.onmicrosoft.com/a4a8e726-c1cc-407c-83a0-4ce37f1ce130/user_impersonation";

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
            {
                options.CallbackPath = "/signin-oidc";
                options.Authority = authority;
                options.ResponseType = "code";
                options.ClientId = clientId;
                options.ClientSecret = clientSecret;

                options.Scope.Clear();
                options.Scope.Add("openid");
                options.Scope.Add(scope);
                options.SaveTokens = true;
            });

            return services;
        }
    }
}
