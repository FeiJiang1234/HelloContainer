namespace Todo.Domain.Abstractions
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAll();

        T Add (T entity);
    }
}
