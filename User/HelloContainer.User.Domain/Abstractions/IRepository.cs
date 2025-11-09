using System.Linq.Expressions;

namespace Todo.Domain.Abstractions
{
    public interface IRepository<T> where T : class
    {
        Task<T?> GetAsync(Expression<Func<T, bool>> predict, CancellationToken cancellationToken = default(CancellationToken));

        Task<IEnumerable<T>> GetAll();

        T Add (T entity);
        void Update(T entity);
    }
}
