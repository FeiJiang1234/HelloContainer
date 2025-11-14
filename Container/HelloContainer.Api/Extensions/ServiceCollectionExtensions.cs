using HelloContainer.Application.Mappings;
using HelloContainer.Infrastructure.Repositories;
using HelloContainer.Infrastructure;
using Microsoft.EntityFrameworkCore;
using HelloContainer.Application.EventHandlers;
using HelloContainer.Application.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using HelloContainer.Domain.Abstractions;
using HelloContainer.Domain.Services;
using HelloContainer.Application;
using MassTransit;
using HelloContainer.Api.Settings;
using Microsoft.Extensions.Options;
using HelloContainer.Application.Authorization;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using HelloContainer.Api.Options;
using HelloContainer.Application.Services;

namespace HelloContainer.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection ConfigureApiService(this IServiceCollection services, IConfiguration configuration)
        {
            var apiOptions = configuration.GetSection("ApiInfo").Get<ApiOptions>()!;
            services.AddHttpClient<UserApiClient>(client =>
            {
                client.BaseAddress = new Uri(apiOptions.UserApiBaseUri!);
            });

            return services;
        }

        public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment)
        {
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy
                        .AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            services.AddMediatR(x =>
            {
                x.Lifetime = ServiceLifetime.Scoped;
                x.RegisterServicesFromAssemblyContaining<OutboxWriterEventHandler>();
            });

            services.AddAspNetContext(UserContext.ParseFromHttpContextOnEntryPoint);

            services.Configure<MessageBrokerSettings>(configuration.GetSection("MessageBroker"));
            services.AddSingleton(sp => sp.GetRequiredService<IOptions<MessageBrokerSettings>>().Value);

            services.AddMassTransit(c =>
            {
                c.SetKebabCaseEndpointNameFormatter();
                //c.UsingRabbitMq((context, cfg) =>
                //{
                //    var settings = context.GetRequiredService<IOptions<MessageBrokerSettings>>().Value;

                //    cfg.Host(settings.Host, h =>
                //    {
                //        h.Username(settings.Username);
                //        h.Password(settings.Password);
                //    });

                //    cfg.ConfigureEndpoints(context);
                //});

                c.UsingAzureServiceBus((context, cfg) =>
                {
                    var connectionString = configuration.GetConnectionString("ServiceBus");
                    cfg.Host(connectionString);
                    cfg.ConfigureEndpoints(context);
                });
            });

            services.AddHostedService<OutboxBackgroundService>();

            services.AddAutoMapper(typeof(ContainerMappingProfile).Assembly);

            // Add FluentValidation
            services.AddFluentValidationAutoValidation()
                .AddValidatorsFromAssemblyContaining<CreateContainerDtoValidator>();

            // Add DbContext
            services.AddDbContext<HelloContainerDbContext>(options =>
                options.UseCosmos(
                    configuration.GetConnectionString("CosmosDB") ?? throw new InvalidOperationException("Connection string 'CosmosDB' not found."),
                    databaseName: configuration.GetSection("DatabaseSettings:DatabaseName").Value ?? throw new InvalidOperationException("Database name not found in configuration.")
                ));

            // Add Services
            services.AddScoped<IContainerRepository, ContainerRepository>();
            services.AddScoped<IAlertRepository, AlertRepository>();
            services.AddScoped<IOutboxRepository, OutboxRepository>();
            services.AddScoped<ContainerService>();
            services.AddScoped<ContainerManager>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<ContainerFactory>();
            services.AddScoped<AlertService>();
            services.AddScoped<IUserRoleRetriever, UserRolesRetriever>();

            return services;
        }

        public static IMvcBuilder AddDWJsonOptions(this IMvcBuilder builder, Action<JsonOptions>? configure = default!)
        {
            return builder.AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.GloballyInitialize();
                options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                configure?.Invoke(options);
            });
        }

        public static IServiceCollection AddJsonSerializerOptions(this IServiceCollection services, Action<JsonSerializerOptions>? setupAction = null)
        {
            services.AddOptions<JsonSerializerOptions>().Configure(o =>
            {
                o.GloballyInitialize();
                setupAction?.Invoke(o);
            });

            return services;
        }

        //public static IOpenTelemetryBuilder AddContainerOpenTelemetry(
        //    this IServiceCollection services,
        //    IConfiguration configuration,
        //    Action<AzureMonitorOptions>? configureAzureMonitor = null,
        //    Action<OpenTelemetryLoggerOptions>? configureLogging = null
        //)
        //{
        //    var otel = services.AddOpenTelemetry();

        //    services.Configure<AspNetCoreTraceInstrumentationOptions>(t =>
        //    {
        //        t.Filter = (httpContext) =>
        //        !new HashSet<string> {
        //        "/health"
        //        }.Contains(httpContext.Request.Path.ToString().ToLowerInvariant());
        //    });

        //    // Add Metrics for ASP.NET Core and our custom metrics and export via OTLP
        //    otel.WithMetrics(metrics =>
        //    {
        //        // Metrics provider from OpenTelemetry
        //        metrics.AddAspNetCoreInstrumentation();
        //        // Metrics provides by ASP.NET Core in .NET 8
        //        metrics.AddMeter("Microsoft.AspNetCore.Hosting");
        //        metrics.AddMeter("Microsoft.AspNetCore.Server.Kestrel");
        //    });

        //    // Add Logging for ASP.NET Core and our custom logs and export via OTLP
        //    otel.WithLogging(null, o =>
        //    {
        //        o.IncludeFormattedMessage = true;
        //        o.IncludeScopes = true;
        //        o.ParseStateValues = true;

        //        configureLogging?.Invoke(o);
        //    });

        //    // Add Tracing for ASP.NET Core and our custom ActivitySource and export via OTLP
        //    otel.WithTracing(b =>
        //    {
        //        b.AddSource(DiagnosticHeaders.DefaultListenerName);
        //    });

        //    var connectionString = Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING");

        //    if (!string.IsNullOrWhiteSpace(connectionString))
        //    {
        //        otel
        //        .UseAzureMonitor(o =>
        //        {
        //            o.ConnectionString = connectionString;
        //            configureAzureMonitor?.Invoke(o);
        //        });
        //    }

        //    return otel;
        //}
    }
}
