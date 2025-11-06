
using HelloContainer.DTOs;

namespace HelloContainer.Application.Authorization
{
    public class UserRolesRetriever : IUserRoleRetriever
    {
        public async Task<UserRole> Retrieve(Guid userId)
        {
            if (userId == Guid.Parse("36f17b7f-3829-4e61-8106-d9047bd04dc4"))
                return new UserRole("administrator");

            return await Task.FromResult(new UserRole("reader"));
        }
    }
}
