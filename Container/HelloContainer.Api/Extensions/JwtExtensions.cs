using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.IdentityModel.Tokens.Jwt;

namespace HelloContainer.Api.Extensions
{
    public static class JwtExtensions
    {
        public static AuthenticationBuilder AddJwt(this AuthenticationBuilder builder)
        {
            builder.AddJwtBearer(options =>
            {
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
                        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
                        {
                            var token = authHeader.Substring(7);
                            try
                            {
                                var handler = new JwtSecurityTokenHandler();
                                var jsonToken = handler.ReadJwtToken(token);

                                var identity = new System.Security.Claims.ClaimsIdentity(jsonToken.Claims, "jwt");
                                identity.AddClaim(new System.Security.Claims.Claim("auth_method", "no_validation"));

                                var principal = new System.Security.Claims.ClaimsPrincipal(identity);

                                context.Principal = principal;
                                context.Success();
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"❌ Failed to parse JWT token: {ex.Message}");
                                context.Fail("Invalid JWT format");
                            }
                        }
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = context =>
                    {
                        Console.WriteLine($"ℹ️ OnTokenValidated called unexpectedly");
                        return Task.CompletedTask;
                    },
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine($"❌ JWT Authentication failed: {context.Exception?.Message}");
                        return Task.CompletedTask;
                    }
                };
            });

            return builder;
        }
    }
}
