using Microsoft.EntityFrameworkCore;
using Todo.Domain.Abstractions;

namespace Todo.Infrastructure
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly UserDbContext _dbContext;

        public Repository(UserDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public T Add(T entity)
        {
            return _dbContext.Add(entity).Entity;
        }

        public async Task<IEnumerable<T>> GetAll()
        {
           return await _dbContext.Set<T>().ToListAsync();
        }
    }
}
