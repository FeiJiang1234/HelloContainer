using System.Text.Json.Serialization;
using System.Text.Json;

namespace HelloContainer.Api.Extensions
{
    public static class DWJsonSerializerOptions
    {
        private static readonly List<JsonConverter> JsonConverters = new List<JsonConverter>
        {
            new JsonStringEnumConverter()
        };

        public static JsonSerializerOptions GloballyInitialize(this JsonSerializerOptions options)
        {
            options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.PropertyNameCaseInsensitive = true;
            options.NumberHandling = JsonNumberHandling.AllowReadingFromString;

            JsonConverters.ForEach(c =>
            {
                if (options.Converters.All(cc => cc.GetType() != c.GetType()))
                    options.Converters.Add(c);
            });
            return options;
        }
    }
}
