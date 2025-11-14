using HelloContainer.Application.ContextAccessor;

namespace HelloContainer.Api.Middleware
{
    public class AspNetContextMiddleware<T> where T : class
    {
        private readonly RequestDelegate _next;


        public AspNetContextMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var requiredService = context.RequestServices.GetRequiredService<AspNetContextAccessor<T>>();
            if (requiredService.Initialized)
            {
                await _next(context);
                return;
            }

            requiredService.Initialize(context);
            await _next(context);
        }
    }
}
