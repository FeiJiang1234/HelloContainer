using Microsoft.AspNetCore.Http;

namespace HelloContainer.Application.ContextAccessor
{
    public interface IContextCreator<in T> where T : class
    {
        void Initialize(HttpContext httpContext);
    }
}