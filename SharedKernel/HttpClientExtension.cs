using System.Net.Http;
using System.Text.Json;

namespace HelloContainer.SharedKernel
{
    public static class HttpClientExtension
    {
        public static async Task<T?> GetAsync<T>(this HttpClient httpClient, string url)
        {
            var response = await httpClient.GetAsync(url);
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                return default;

            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<T>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

        public static async Task<TResponse?> PostAsync<TRequest, TResponse>(this HttpClient httpClient, string url, TRequest dto)
        {
            var json = JsonSerializer.Serialize(dto);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync(url, content);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<TResponse>(responseJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

        public static async Task PostAsync<T>(this HttpClient httpClient, string url, T dto)
        {
            var json = JsonSerializer.Serialize(dto);
            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            await httpClient.PostAsync(url, content);
        }
    }
}
