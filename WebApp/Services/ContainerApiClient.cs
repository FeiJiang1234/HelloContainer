using HelloContainer.SharedKernel;
using HelloContainer.WebApp.Dtos;

namespace HelloContainer.WebApp.Services;

public class ContainerApiClient
{
    private readonly HttpClient _httpClient;

    public ContainerApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<ContainerDto>?> GetContainersAsync(string? searchKeyword = null)
    {
        var url = "api/containers";
        if (!string.IsNullOrEmpty(searchKeyword))
        {
            url += $"?searchKeyword={Uri.EscapeDataString(searchKeyword)}";
        }

        return await _httpClient.GetAsync<List<ContainerDto>>(url);
    }

    public async Task<ContainerDto?> GetContainerByIdAsync(Guid id)
    {
        return await _httpClient.GetAsync<ContainerDto>($"api/containers/{id}");
    }

    public async Task<ContainerDto?> CreateContainerAsync(CreateContainerDto createDto)
    {
        return await _httpClient.PostAsync<CreateContainerDto, ContainerDto>($"api/containers", createDto);
    }

    public async Task<ContainerDto?> AddWaterAsync(Guid id, double amount)
    {
        var addWaterDto = new AddWaterDto(id, amount);
        return await _httpClient.PostAsync<AddWaterDto, ContainerDto>($"api/containers/{id}/water", addWaterDto);
    }

    public async Task DeleteContainerAsync(Guid id)
    {
        var response = await _httpClient.DeleteAsync($"api/containers/{id}");
        response.EnsureSuccessStatusCode();
    }

    public async Task ConnectContainersAsync(Guid sourceId, Guid targetId)
    {
        var connectDto = new ConnectContainersDto(sourceId, targetId);
        await _httpClient.PostAsync("api/containers/connections", connectDto);
    }

    public async Task DisconnectContainersAsync(Guid sourceId, Guid targetId)
    {
        var disconnectDto = new DisconnectContainersDto(sourceId, targetId);
        await _httpClient.PostAsync("api/containers/disconnections", disconnectDto);
    }
}

