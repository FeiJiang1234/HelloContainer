using HelloContainer.WebApp.Dtos;
using System.Text.Json;

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
            var response = await _httpClient.GetAsync($"api/users/{id}");
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                return null;

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<UserReadDto>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
    }
}
