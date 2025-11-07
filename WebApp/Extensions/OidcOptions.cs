using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace HelloContainer.WebApp.Extensions
{
    public class OidcOptions : OAuth2Options
    {
        public string ResponseType { get; set; } = "code";
        public OpenIdConnectRedirectBehavior AuthenticationMethod { get; set; } = OpenIdConnectRedirectBehavior.RedirectGet;
        public new string Authority { get; set; } = string.Empty;
        public string TenantId { get; set; } = string.Empty;
    }
}
