using HelloContainer.User.Domain;
using Microsoft.EntityFrameworkCore;

namespace Todo.Infrastructure
{
    public class UserDbContext : DbContext
    {
        public DbSet<User> Users => Set<User>();

        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
