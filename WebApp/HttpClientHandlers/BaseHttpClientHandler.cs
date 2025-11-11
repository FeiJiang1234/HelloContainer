using Microsoft.AspNetCore.Authentication;

namespace HelloContainer.WebApp.HttpClientHandlers
{
    public class BaseHttpClientHandler : DelegatingHandler
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BaseHttpClientHandler(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var accessToken = _httpContextAccessor.HttpContext?.GetTokenAsync("access_token").Result;
            request.Headers.Add("Authorization", "Bearer " + accessToken);

            return await base.SendAsync(request, cancellationToken);
        }
    }
}
