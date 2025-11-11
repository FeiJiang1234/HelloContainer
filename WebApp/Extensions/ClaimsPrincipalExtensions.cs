using System.Security.Claims;

namespace HelloContainer.WebApp.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetDisplayName(this ClaimsPrincipal principal)
        {
            if (principal?.Identity == null || !principal.Identity.IsAuthenticated)
            {
                return "Guest";
            }

            return principal.FindFirst("name")?.Value;
        }
    }
}