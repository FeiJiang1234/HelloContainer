using HelloContainer.Api.Authorization;
using HelloContainer.Application.Authorization;
using HelloContainer.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace HelloContainer.Api.OPA
{
    public class OpaPolicyHandler : AuthorizationHandler<OpaPolicyRequirement>
    {
        protected const string ControllerRouteKey = "controller";
        protected const string ActionRouteKey = "action";
        protected readonly IUserRoleRetriever _rolesRetriever;
        protected readonly JsonSerializerOptions? _jsonSerializerOptions;
        private readonly HttpClient _httpClient;

        public OpaPolicyHandler(IUserRoleRetriever rolesRetriever, IOptions<JsonSerializerOptions>? jsonSerializerOptions, IHttpClientFactory httpClientFactory)
        {
            _rolesRetriever = rolesRetriever;
            _jsonSerializerOptions = jsonSerializerOptions?.Value;
            _httpClient = httpClientFactory.CreateClient(nameof(OpaPolicyHandler));
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, OpaPolicyRequirement requirement)
        {
            if (context.User.Identity?.IsAuthenticated != true) return;

            if (context.Resource is HttpContext httpContext)
            {
                if (await EvalPolicy(httpContext, requirement))
                {
                    context.Succeed(requirement);
                    return;
                }
            }

            context.Fail();
        }

        protected async Task<bool> EvalPolicy(HttpContext httpContext, OpaPolicyRequirement requirement)
        {
            var metadata = httpContext.GetEndpoint()!.Metadata;
            var attrs = metadata.GetOrderedMetadata<OpaScopeDescribeAttribute>();
            var opaAuthAttr = metadata.GetMetadata<OpaAuthorizeAttribute>();

            var scopeParams = new List<UserRoleScope>();
            if (attrs != null)
            {
                foreach (var attr in attrs)
                {
                    var values = await ExtractScopeRefValues(httpContext, attr);

                    if (values.Any())
                    {
                        if (!string.IsNullOrEmpty(attr.Scope))
                            scopeParams.AddRange(values.Select(val => new UserRoleScope(attr.Scope!, val))!);
                    }
                }
            }

            var userId = httpContext.User.FindFirst("sub")?.Value;
            var userName = httpContext.User.FindFirst("name")?.Value;
            if (string.IsNullOrEmpty(userId))
                return false;
                
            var role = await _rolesRetriever.Retrieve(Guid.Parse(userId), userName, scopeParams);

            var allow = await EvalOpaPolicyAsync(
                    role,
                    httpContext,
                    requirement,
                    opaAuthAttr?.IncludeRequestPayloadInAuthContext ?? false
                );

            return allow.GetValueOrDefault(false);
        }

        private async Task<IEnumerable<string>> ExtractScopeRefValues(HttpContext httpContext, OpaScopeDescribeAttribute opaScopeAttr)
        {
            switch (opaScopeAttr.BindingType)
            {
                case ParameterBindingType.InRoute when
                    !string.IsNullOrEmpty(opaScopeAttr.BindingKey)
                    && httpContext.GetRouteData().Values.TryGetValue(opaScopeAttr.BindingKey, out var value)
                    && value != null:
                    return new[] { value.ToString() }!;

                case ParameterBindingType.InBody:
                    {
                        var json = await ReadRequestBodyAsJsonDocumentAsync(httpContext);
                        var valProp = json.RootElement;

                        if (string.IsNullOrEmpty(opaScopeAttr.BindingKey) || TryGetProperty(json.RootElement, opaScopeAttr.BindingKey, out valProp))
                        {
                            var val = valProp.ValueKind == JsonValueKind.String
                                ? valProp.GetString()
                                : valProp.GetRawText();

                            if (!string.IsNullOrEmpty(val))
                                return new[] { val };
                        }

                        break;
                    }
            }

            return Enumerable.Empty<string>();
        }

        private static async Task<JsonDocument> ReadRequestBodyAsJsonDocumentAsync(HttpContext httpContext)
        {
            httpContext.Request.EnableBuffering();
            var json = await JsonDocument.ParseAsync(httpContext.Request.Body);
            httpContext.Request.Body.Seek(0, SeekOrigin.Begin);
            return json;
        }

        private static bool TryGetProperty(JsonElement element, string propertyName, out JsonElement value)
        {
            bool result = false;
            var property = element.EnumerateObject()
                .FirstOrDefault(p => p.Name.Equals(propertyName, StringComparison.OrdinalIgnoreCase));

            if (property.Value.ValueKind != JsonValueKind.Undefined)
            {
                value = property.Value;
                result = true;
            }
            else
            {
                value = default;
            }
            return result;
        }

        internal async Task<bool?> EvalOpaPolicyAsync(
            IEnumerable<UserRoleLookupEntry> roles,
            HttpContext httpContext,
            OpaPolicyRequirement requirement,
            bool includePayloadInContext = false
        )
        {
            bool allow = false;

            try
            {
                var routeValues = httpContext.GetRouteData().Values;

                if (!routeValues.TryGetValue(ControllerRouteKey, out var controller)
                    || !routeValues.TryGetValue(ActionRouteKey, out var action)
                    || !httpContext.Request.Path.StartsWithSegments($"{requirement.ApiPathPrefix}",
                        StringComparison.OrdinalIgnoreCase, out var apiPath))
                {
                    throw new Exception("Route values or API path prefix version are not matched.");
                }

                var path = apiPath.Value?.Trim('/').ToLowerInvariant().Split('/');
                var args = routeValues
                    .Where(r => r.Key != ControllerRouteKey
                                && r.Key != ActionRouteKey)
                    .Select(r => r.Value?.ToString()?.ToLowerInvariant()).ToArray();

                var opName = $"{httpContext.Request.Method}_{controller}_{action}_{routeValues.Count - 2}";
                var evalUri = new Uri($"{requirement.OpaApiBaseUrl}/{requirement.PolicyEvalEndpoint}/{opName}");

                var requestPayload = includePayloadInContext ?
                        await ReadRequestBodyAsJsonAsync(httpContext) : null;

                var authContext = new
                {
                    Input = new
                    {
                        httpContext.Request.Method,
                        Path = path,
                        Args = args,
                        Context = new
                        {
                            RoleLookup = roles,
                            Payload = requestPayload
                        },
                    }
                };
                var eval = await PostOpaEval(evalUri.AbsoluteUri, authContext);
                allow = eval?.Result ?? false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[OPA Debug] Error in EvalOpaPolicyAsync: {ex.Message}");
            }

            return allow;
        }

        private async Task<OpaEvalResponse?> PostOpaEval(string uri, object body)
        {
            using var stream = new MemoryStream();
            await JsonSerializer.SerializeAsync(stream, body, _jsonSerializerOptions);
            stream.Position = 0;

            stream.Position = 0;
            using var reader = new StreamReader(stream, leaveOpen: true);
            var jsonContent = await reader.ReadToEndAsync();
            Console.WriteLine($"[OPA Debug] Sending to {uri}:");
            Console.WriteLine(jsonContent);
            stream.Position = 0;

            var httpRequest = new HttpRequestMessage(HttpMethod.Post, uri)
            {
                Content = new StreamContent(stream)
                {
                    Headers =
                    {
                        ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json")
                    }
                }
            };

            var httpResponse = await _httpClient.SendAsync(httpRequest);
            httpResponse.EnsureSuccessStatusCode();
            return await httpResponse.Content.ReadFromJsonAsync<OpaEvalResponse>(_jsonSerializerOptions);
        }

        private static async Task<JsonNode?> ReadRequestBodyAsJsonAsync(HttpContext httpContext)
        {
            httpContext.Request.EnableBuffering();
            var json = await JsonSerializer.DeserializeAsync<JsonNode>(httpContext.Request.Body);
            httpContext.Request.Body.Seek(0, SeekOrigin.Begin);
            return json;
        }
    }

    public class OpaEvalResponse
    {
        public bool Result { get; set; }
    }
}
