using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace HelloContainer.Api.Extensions
{
    public static class JwtExtensions
    {
        public static AuthenticationBuilder AddJwt(this AuthenticationBuilder builder)
        {
            builder.AddJwtBearer(options =>
            {
                options.Authority = "https://logintest.veracity.com/tfp/ed815121-cdfa-4097-b524-e2b23cd36eb6/B2C_1A_SignInWithADFSIdp/v2.0";
                options.Audience = "a4a8e726-c1cc-407c-83a0-4ce37f1ce130";

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
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
