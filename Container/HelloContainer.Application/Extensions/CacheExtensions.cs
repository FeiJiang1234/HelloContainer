using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using System.Text;

namespace HelloContainer.Application.Extensions
{
    public static class CacheExtensions
    {
        public static async Task<T?> GetFromJsonAsync<T>(this IDistributedCache cache, string key, JsonSerializerOptions? jsonSerializerOptions = null, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException("key");
            }

            string text = await cache.GetStringAsync(key, cancellationToken);
            return (T?)(!string.IsNullOrEmpty(text) ? JsonSerializer.Deserialize<T>(text, jsonSerializerOptions) : (object)default(T));
        }

        public static async Task SetToJsonAsync<T>(this IDistributedCache cache, string key, T value, JsonSerializerOptions? jsonSerializerOptions = null, DistributedCacheEntryOptions? cacheEntryOptions = null, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException("key");
            }

            string value2 = JsonSerializer.Serialize(value, jsonSerializerOptions);
            await (cacheEntryOptions == null ? cache.SetStringAsync(key, value2, cancellationToken) : cache.SetStringAsync(key, value2, cacheEntryOptions, cancellationToken));
        }

        public static async Task<T> CacheForResult<T>(this IDistributedCache cache, string key, Func<Task<T>> func, JsonSerializerOptions? jsonSerializerOptions = null, DistributedCacheEntryOptions? cacheEntryOptions = null, CancellationToken cancellationToken = default)
        {
            T result = await cache.GetFromJsonAsync<T>(key, jsonSerializerOptions, cancellationToken);
            if (result == null)
            {
                result = await func();
                await cache.SetToJsonAsync(key, result, jsonSerializerOptions, cacheEntryOptions, cancellationToken);
            }

            return result;
        }

        public static string HashCacheKey(this IEnumerable<string> seeds)
        {
            List<string> source = seeds.ToList();
            if (!source.Any())
            {
                return string.Empty;
            }

            return Convert.ToBase64String(Encoding.UTF8.GetBytes(source.Aggregate("", (a, b) => a + "|" + b)));
        }
    }
}
