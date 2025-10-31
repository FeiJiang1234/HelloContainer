using Microsoft.AspNetCore.Authorization;

namespace HelloContainer.Api.OPA
{
    public class OpaPolicyRequirement : IAuthorizationRequirement
    {
        public string? OpaPolicyName { get; set; }

        public string? OpaApiBaseUrl { get; set; }

        public string? PolicyEvalEndpoint { get; set; }

        public string? ApiPathPrefix { get; set; }
    }
}
