using Microsoft.EntityFrameworkCore;
using System;
using System.Linq.Expressions;
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

        public async Task<T?> GetAsync(Expression<Func<T, bool>> predict, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Set<T>().FirstOrDefaultAsync(predict, cancellationToken);
        }

        public void Update(T entity)
        {
            _dbContext.Update(entity);
        }
    }
}
