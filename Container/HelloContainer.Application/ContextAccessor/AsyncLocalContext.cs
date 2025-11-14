namespace HelloContainer.Application.ContextAccessor
{
    public class AsyncLocalContext<T> where T : class
    {
        private readonly AsyncLocal<T?> _contextHolder;

        public bool HasValue => _contextHolder.Value != null;

        public T? Payload => _contextHolder.Value;

        public AsyncLocalContext()
        {
            _contextHolder = new AsyncLocal<T?>();
        }

        public void CreateContext(T? payload)
        {
            _contextHolder.Value = payload;
        }
    }
}
