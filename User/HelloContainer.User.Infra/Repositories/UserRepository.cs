using HelloContainer.User.Domain;
using Todo.Domain.Abstractions;

namespace Todo.Infrastructure.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(UserDbContext dbContext) : base(dbContext)
        {

        }
    }
}
