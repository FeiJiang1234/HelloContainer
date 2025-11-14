using Microsoft.AspNetCore.Http;

namespace HelloContainer.Application.ContextAccessor
{
    public class AspNetContextAccessor<T> : IContextAccessor<T>, IContextCreator<T> where T : class
    {
        private readonly AsyncLocalContext<T> _asyncLocalContext;

        private readonly Func<HttpContext, (bool, T?)> _payloadCreator;

        public bool Initialized => _asyncLocalContext.HasValue;

        public T? Context
        {
            get
            {
                if (!_asyncLocalContext.HasValue)
                {
                    return null;
                }

                return _asyncLocalContext.Payload;
            }
        }

        public AspNetContextAccessor(Func<HttpContext, (bool, T?)> payloadCreator)
        {
            _asyncLocalContext = new AsyncLocalContext<T>();
            _payloadCreator = payloadCreator;
        }

        public void Initialize(HttpContext httpContext)
        {
            if (Initialized)
                return;

            var (success, payload) = _payloadCreator(httpContext);
            if (success && payload != null)
            {
                _asyncLocalContext.CreateContext(payload);
            }
        }
    }
}
