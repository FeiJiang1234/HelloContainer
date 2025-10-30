using Todo.Domain.Abstractions;

namespace Todo.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        public UserDbContext DbContext { get; }

        public UnitOfWork(UserDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
           return await DbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
