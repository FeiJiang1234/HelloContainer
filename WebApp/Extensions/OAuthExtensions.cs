using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace HelloContainer.WebApp.Extensions
{
    public static class OAuthExtensions
    {
        public static AuthenticationBuilder AddOidc(this IServiceCollection services, Action<OidcOptions> oidcSetupAction)
        {
            OidcOptions oidcOptions = new OidcOptions();
            oidcSetupAction(oidcOptions);
            return services.AddOidc(oidcOptions);
        }

        public static AuthenticationBuilder AddOidc(this IServiceCollection services, OidcOptions oidcOptions)
        {
            return services.AddAuthentication(delegate (AuthenticationOptions o)
            {
                o.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            }).AddOidc(oidcOptions);
        }

        public static AuthenticationBuilder AddOidc(this AuthenticationBuilder builder, OidcOptions oidcOptions)
        {
            OidcOptions oidcOptions2 = oidcOptions;
            builder = builder.AddCookie("Cookies");
            builder.AddOpenIdConnect("OpenIdConnect", delegate (OpenIdConnectOptions o)
            {
                ConfigureOidcOptions(o, oidcOptions2);
            });

            return builder;
        }

        private static void ConfigureOidcOptions(OpenIdConnectOptions options, OidcOptions oidcOptions)
        {
            options.Authority = oidcOptions.Authority;
            options.ClientId = oidcOptions.ClientId;
            options.ClientSecret = oidcOptions.ClientSecret;
            options.CallbackPath = oidcOptions.CallbackPath;
            options.ResponseType = oidcOptions.ResponseType;
            options.AuthenticationMethod = oidcOptions.AuthenticationMethod;
            options.UsePkce = true;
            ConfigureScopes(oidcOptions, options);
        }

        private static void ConfigureScopes(OidcOptions oidcOptions, OpenIdConnectOptions o)
        {
            string[] scopes = oidcOptions.Scopes;
            if (scopes == null || !scopes.Any())
            {
                oidcOptions.Scopes = new string[1] { oidcOptions.ClientId };
            }

            string[] scopes2 = oidcOptions.Scopes;
            foreach (string item in scopes2)
            {
                o.Scope.Add(item);
            }
        }
    }
}
