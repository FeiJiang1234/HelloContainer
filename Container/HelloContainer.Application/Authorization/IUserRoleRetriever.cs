
using HelloContainer.DTOs;

namespace HelloContainer.Application.Authorization
{
    public interface IUserRoleRetriever
    {
        Task<UserRole> Retrieve(Guid userId);
    }
}
