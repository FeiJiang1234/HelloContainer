using HelloContainer.WebApp.Dtos;
using HelloContainer.SharedKernel;

namespace HelloContainer.WebApp.Services
{
    public class UserApiClient
    {
        private readonly HttpClient _httpClient;

        public UserApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<UserReadDto?> GetUserByIdAsync(Guid id)
        {
            return await _httpClient.GetAsync<UserReadDto>($"api/users/{id}");
        }
    }
}
