using HelloContainer.Api.Extensions;
using HelloContainer.Api.Middleware;
using HelloContainer.Api.OPA;
using HelloContainer.Api.Services;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    //options.Authority = "https://logintest.veracity.com/tfp/ed815121-cdfa-4097-b524-e2b23cd36eb6/B2C_1A_SignInWithADFSIdp/v2.0";
    options.Authority = "https://login.microsoftonline.com/a7cd5b59-9f45-477d-b7d6-60fc2dd177a1/v2.0";
    options.Audience = "2b64a7f1-5fae-420b-a5f7-7be79d54ba74";
    options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
    
    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = context =>
        {
            Console.WriteLine($"JWT Token validated for user: {context.Principal?.Identity?.Name}");
            Console.WriteLine("Available Claims:");
            foreach (var claim in context.Principal?.Claims ?? Enumerable.Empty<System.Security.Claims.Claim>())
            {
                Console.WriteLine($"  {claim.Type}: {claim.Value}");
            }
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"JWT Authentication failed: {context.Exception?.Message}");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddControllers().AddDWJsonOptions();
builder.Services.AddJsonSerializerOptions();

builder.Services.AddOpaPolicyAuthorization();

builder.Services.AddAuthorization(o =>
{
    o.AddPolicy("OpaPolicy", p =>
    {
        var opaPolicyRequirement = new OpaPolicyRequirement();
        configuration.Bind("OpaPolicy", opaPolicyRequirement);
        p.AddRequirements(opaPolicyRequirement);
    });
});

// App Insights
//builder.Services.AddApplicationInsightsTelemetry();

builder.Services.AddStackExchangeRedisCache(o =>
{
    o.Configuration = "";
    o.InstanceName = $"Container-Dev";
});
builder.Services.Configure<DistributedCacheEntryOptions>(o => o.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer()
.AddSwaggerGen(c =>
 {
     c.SwaggerDoc("v1", new OpenApiInfo { Title = "HelloContainer API", Version = "v1" });

     c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
     {
         Type = SecuritySchemeType.OAuth2,
         Scheme = "OAuth2",
         Flows = new OpenApiOAuthFlows
         {
             Implicit = new OpenApiOAuthFlow
             {
                 AuthorizationUrl = new Uri($"https://logintest.veracity.com/ed815121-cdfa-4097-b524-e2b23cd36eb6/b2c_1a_signinwithadfsidp/oauth2/v2.0/authorize"),
                 Scopes = new Dictionary<string, string>
                 {
                    { $"https://dnvglb2ctest.onmicrosoft.com/2b64a7f1-5fae-420b-a5f7-7be79d54ba74/user_impersonation", "Access API as user" }
                 }
             }
         }
     });

     c.AddSecurityRequirement(new OpenApiSecurityRequirement
     {
         {
             new OpenApiSecurityScheme
             {
                 Reference = new OpenApiReference
                 {
                     Type = ReferenceType.SecurityScheme,
                     Id = "oauth2"
                 }
             },
             new[] { "https://dnvglb2ctest.onmicrosoft.com/2b64a7f1-5fae-420b-a5f7-7be79d54ba74/user_impersonation" }
         }
     });
 });


// Add OPA services
builder.Services.AddHttpClient<IOpaService, OpaService>(client =>
{
    var opaBaseUrl = configuration["Opa:BaseUrl"] ?? "http://localhost:8181";
    client.BaseAddress = new Uri(opaBaseUrl);
});

builder.Services.AddServices(configuration, builder.Environment);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HelloContainer API V1");
        c.OAuthClientId(configuration["Swagger:OAuth:ClientId"]);
        c.OAuthUsePkce();
        c.OAuthScopeSeparator(" ");
    });
}

app.UseHttpsRedirection();

// Add domain exception handler middleware
app.UseDomainExceptionHandler();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseCors();

app.Run();

namespace HelloContainer.Api
{
    internal partial class Program { }
}