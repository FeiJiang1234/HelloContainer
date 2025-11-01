using HelloContainer.Api.Extensions;
using HelloContainer.Api.Middleware;
using HelloContainer.Api.OPA;
using HelloContainer.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(configuration.GetSection("AzureAd"));

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

// Redis
// 配置 JsonSerializerOptions 以便通过 IOptions 注入
//builder.Services.Configure<JsonSerializerOptions>(options =>
//{
//    options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
//    options.WriteIndented = true;
//    options.AllowTrailingCommas = true;
//});

// 也注册为单例以便直接注入使用
builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<JsonSerializerOptions>>().Value);

builder.Services.AddStackExchangeRedisCache(o =>
{
    o.Configuration = "";
    o.InstanceName = $"Container-Dev";
});
builder.Services.Configure<DistributedCacheEntryOptions>(o => o.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "HelloContainer API", Version = "v1" });
    
    var azureAdConfig = configuration.GetSection("AzureAd");
    var tenantId = azureAdConfig["TenantId"];
    var clientId = azureAdConfig["ClientId"];
    
    c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OAuth2,
        Flows = new OpenApiOAuthFlows
        {
            AuthorizationCode = new OpenApiOAuthFlow
            {
                AuthorizationUrl = new Uri($"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/authorize"),
                TokenUrl = new Uri($"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token"),
                Scopes = new Dictionary<string, string>
                {
                    { $"https://fredadgroup.onmicrosoft.com/{clientId}/AllAccess", "Access API as user" }
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
            new[] { $"https://fredadgroup.onmicrosoft.com/{clientId}/AllAccess" }
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
        c.OAuthClientId(configuration["AzureAd:ClientId"]);
        c.OAuthUsePkce(); // Enable PKCE for security
        c.OAuthScopeSeparator(" ");
    });
}

app.UseHttpsRedirection();

// Add domain exception handler middleware
app.UseDomainExceptionHandler();

app.UseAuthentication();
app.UseAuthorization();

//app.UseMiddleware<OpaAuthorizationMiddleware>();

app.MapControllers();

app.UseCors();

app.Run();

namespace HelloContainer.Api
{
    internal partial class Program { }
}