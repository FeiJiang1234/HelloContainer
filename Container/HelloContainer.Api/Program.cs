using HelloContainer.Api.Extensions;
using HelloContainer.Api.Middleware;
using HelloContainer.Api.OPA;
using HelloContainer.Api.Services;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwt();

builder.Services.AddControllers().AddDWJsonOptions();
builder.Services.AddJsonSerializerOptions();
builder.Services.AddHttpContextAccessor();
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
                 // 使用与token issuer匹配的Azure AD端点
                 AuthorizationUrl = new Uri($"https://login.microsoftonline.com/a7cd5b59-9f45-477d-b7d6-60fc2dd177a1/oauth2/v2.0/authorize"),
                 Scopes = new Dictionary<string, string>
                 {
                    // 使用Microsoft Graph的scope，因为这是你获取的token类型
                    { "https://graph.microsoft.com/User.Read", "Read user profile" },
                    { "openid", "OpenID Connect" },
                    { "profile", "User profile" },
                    { "email", "Email address" }
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
             new[] { "https://graph.microsoft.com/User.Read", "openid", "profile", "email" }
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