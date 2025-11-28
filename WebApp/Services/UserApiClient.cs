using HelloContainer.WebApp.Dtos;
using HelloContainer.SharedKernel;
using Microsoft.Extensions.Caching.Distributed;
using HelloContainer.SharedKernel.Extensions;

namespace HelloContainer.WebApp.Services
{
    public class UserApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly IDistributedCache _distributedCache;

        public UserApiClient(HttpClient httpClient, IDistributedCache distributedCache)
        {
            _httpClient = httpClient;
            _distributedCache = distributedCache;
        }

        public async Task<UserReadDto?> GetUserByIdAsync(Guid id)
        {
            var user = await _distributedCache.CacheForResult(id.ToString(), async () =>
            {
                return await _httpClient.GetAsync<UserReadDto>($"api/users/{id}");
            });

            return user;
        }
    }
}
