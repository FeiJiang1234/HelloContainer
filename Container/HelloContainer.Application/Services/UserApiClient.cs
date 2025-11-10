using HelloContainer.DTOs;
using HelloContainer.SharedKernel;

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
            return await _httpClient.GetAsync<UserReadDto>($"api/users/{id}");
        }

        public async Task<UserReadDto?> CreateUserAsync(UserWriteDto createDto)
        {
            return await _httpClient.PostAsync<UserWriteDto, UserReadDto>($"api/users", createDto);
        }
    }
}
