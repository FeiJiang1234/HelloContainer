using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace HelloContainer.SharedKernel.Extensions
{
    public static class CacheExtensions
    {
        public static async Task<T> CacheForResult<T>(this IDistributedCache cache, string key, Func<Task<T>> func)
        {
            var jsonSerializerOptions = DWJsonSerializerOptions.Create();
            var cacheEntryOptions = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1) };

            T result = await cache.GetFromJsonAsync<T>(key, jsonSerializerOptions, default);
            if (result == null)
            {
                result = await func();

                await cache.SetToJsonAsync(key, result, jsonSerializerOptions, cacheEntryOptions, default);
            }

            return result;
        }

        private static async Task<T?> GetFromJsonAsync<T>(this IDistributedCache cache, string key, JsonSerializerOptions? jsonSerializerOptions = null, CancellationToken cancellationToken = default)
        {
            try
            {
                if (string.IsNullOrEmpty(key))
                {
                    throw new ArgumentNullException("key");
                }

                string text = await cache.GetStringAsync(key, cancellationToken);
                return (T?)(!string.IsNullOrEmpty(text) ?
                    JsonSerializer.Deserialize<T>(text, jsonSerializerOptions) :
                    (object)default(T));
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private static async Task SetToJsonAsync<T>(this IDistributedCache cache, string key, T value, JsonSerializerOptions? jsonSerializerOptions = null, DistributedCacheEntryOptions? cacheEntryOptions = null, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException("key");
            }

            string value2 = JsonSerializer.Serialize(value, jsonSerializerOptions);
            await (cacheEntryOptions == null ?
                cache.SetStringAsync(key, value2, cancellationToken) :
                cache.SetStringAsync(key, value2, cacheEntryOptions, cancellationToken));
        }
    }
}
