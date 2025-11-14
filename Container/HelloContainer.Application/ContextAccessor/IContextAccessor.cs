namespace HelloContainer.Application.ContextAccessor
{
    public interface IContextAccessor<out T> where T : class
    {
        bool Initialized { get; }

        T? Context { get; }
    }
}
