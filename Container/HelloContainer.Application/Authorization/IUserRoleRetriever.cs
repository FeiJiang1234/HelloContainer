
using HelloContainer.DTOs;

namespace HelloContainer.Application.Authorization
{
    public interface IUserRoleRetriever
    {
        Task<IEnumerable<UserRoleLookupEntry>> Retrieve(Guid userId, string name, IEnumerable<UserRoleScope> lookupScopes);
    }
}
