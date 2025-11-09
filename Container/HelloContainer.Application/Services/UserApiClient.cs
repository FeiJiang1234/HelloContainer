using HelloContainer.DTOs;
using System.Text.Json;

namespace HelloContainer.Application.Services
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
            if(response.StatusCode == System.Net.HttpStatusCode.NotFound)
                return null;

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<UserReadDto>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

        public async Task<UserReadDto?> CreateUserAsync(UserWriteDto createDto)
        {
            var json = JsonSerializer.Serialize(createDto);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("api/users", content);

            var responseJson = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<UserReadDto>(responseJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
    }
}
