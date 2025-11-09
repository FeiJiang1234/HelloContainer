using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace HelloContainer.WebApp.Controllers
{
    [Authorize]
    public class TokenController : Controller
    {
        public async Task<IActionResult> Index()
        {
            var authResult = await HttpContext.AuthenticateAsync();
            
            var tokenInfo = new
            {
                IsAuthenticated = User.Identity?.IsAuthenticated ?? false,
                UserName = User.Identity?.Name,
                Claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList(),
                Tokens = new
                {
                    AccessToken = authResult.Properties?.GetTokenValue("access_token"),
                    IdToken = authResult.Properties?.GetTokenValue("id_token"),
                    RefreshToken = authResult.Properties?.GetTokenValue("refresh_token"),
                    TokenType = authResult.Properties?.GetTokenValue("token_type"),
                    ExpiresAt = authResult.Properties?.GetTokenValue("expires_at")
                }
            };

            return Json(tokenInfo);
        }

        public async Task<IActionResult> IdToken()
        {
            var authResult = await HttpContext.AuthenticateAsync();
            var idToken = authResult.Properties?.GetTokenValue("id_token");
            
            if (string.IsNullOrEmpty(idToken))
            {
                return Json(new { Error = "No ID token found" });
            }

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadJwtToken(idToken);

                var tokenDetails = new
                {
                    Header = jsonToken.Header,
                    Payload = jsonToken.Claims.Select(c => new { c.Type, c.Value }).ToList(),
                    ValidFrom = jsonToken.ValidFrom,
                    ValidTo = jsonToken.ValidTo,
                    Issuer = jsonToken.Issuer,
                    Audiences = jsonToken.Audiences.ToList(),
                    RawToken = idToken
                };

                return Json(tokenDetails);
            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }

        public async Task<IActionResult> AccessToken()
        {
            var authResult = await HttpContext.AuthenticateAsync();
            var accessToken = authResult.Properties?.GetTokenValue("access_token");
            
            if (string.IsNullOrEmpty(accessToken))
            {
                return Json(new { Error = "No access token found" });
            }

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadJwtToken(accessToken);

                var tokenDetails = new
                {
                    Header = jsonToken.Header,
                    Payload = jsonToken.Claims.Select(c => new { c.Type, c.Value }).ToList(),
                    ValidFrom = jsonToken.ValidFrom,
                    ValidTo = jsonToken.ValidTo,
                    Issuer = jsonToken.Issuer,
                    Audiences = jsonToken.Audiences.ToList(),
                    Scopes = jsonToken.Claims.Where(c => c.Type == "scp" || c.Type == "scope")
                                           .SelectMany(c => c.Value.Split(' '))
                                           .ToList(),
                    RawToken = accessToken
                };

                return Json(tokenDetails);
            }
            catch (Exception ex)
            {
                return Json(new { Error = ex.Message });
            }
        }
    }
}