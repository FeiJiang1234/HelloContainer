using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace HelloContainer.WebApp.Extensions
{
    public static class OAuthExtensions
    {
        public static AuthenticationBuilder AddOidc(this IServiceCollection services, Action<OpenIdConnectOptions> oidcSetupAction)
        {
            var oidcOptions = new OpenIdConnectOptions();
            oidcSetupAction(oidcOptions);
            return services.AddOidc(oidcOptions);
        }

        public static AuthenticationBuilder AddOidc(this IServiceCollection services, OpenIdConnectOptions oidcOptions)
        {
            return services.AddAuthentication(o =>
            {
                o.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            })
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, o =>
            {
                o.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                o.Authority = oidcOptions.Authority;
                o.ClientId = oidcOptions.ClientId;
                o.ClientSecret = oidcOptions.ClientSecret;
                o.CallbackPath = oidcOptions.CallbackPath;
                o.ResponseType = oidcOptions.ResponseType;
                o.Scope.Clear();
                foreach (var scope in oidcOptions.Scope)
                {
                    o.Scope.Add(scope);
                }
                o.SaveTokens = true;
            });
        }
    }
}
