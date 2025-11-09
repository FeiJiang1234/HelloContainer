
using HelloContainer.Application.Services;
using HelloContainer.Domain.Abstractions;
using HelloContainer.DTOs;

namespace HelloContainer.Application.Authorization
{
    public class UserRolesRetriever : IUserRoleRetriever
    {
        private readonly UserApiClient _userApiClient;
        private readonly IContainerRepository _containerRepository;

        public UserRolesRetriever(UserApiClient userApiClient, IContainerRepository containerRepository)
        {
            _userApiClient = userApiClient;
            _containerRepository = containerRepository;
        }

        public async Task<IEnumerable<UserRoleLookupEntry>> Retrieve(Guid userId, string name, IEnumerable<UserRoleScope> lookupScopes)
        {
            var result = new List<UserRoleLookupEntry>();

            var containerIds = lookupScopes
                .Where(s => s.Scope == RoleScopeTypes.Container)
                .Select(s => Guid.Parse(s.ScopeRef))
                .ToList();
            var containerRoles = await GetRoleScopesForContainer(userId, containerIds);
            result.AddRange(containerRoles);

            var user = await _userApiClient.GetUserByIdAsync(userId);
            if (user == null)
            {
                var newUser = await _userApiClient.CreateUserAsync(new UserWriteDto(userId, name, RoleNames.Reader));
                result.Add(new UserRoleLookupEntry(new UserRoleScope(RoleScopeTypes.User, userId.ToString()), new UserRole(newUser.role)));
            }
            else
            {
                result.Add(new UserRoleLookupEntry(new UserRoleScope(RoleScopeTypes.User, userId.ToString()), new UserRole(user.role)));
            }

            return result;
        }

        public async Task<IEnumerable<UserRoleLookupEntry>> GetRoleScopesForContainer(Guid userId, IEnumerable<Guid> containerIds)
        {
            var result = new List<UserRoleLookupEntry>();
            var getContainerTasks = containerIds.Select(x => _containerRepository.GetById(x));
            var containers = await Task.WhenAll(containerIds.Select(x => _containerRepository.GetById(x)));

            foreach (var container in containers)
            {
                if (container.CreatedBy == userId)
                {
                    result.Add(new UserRoleLookupEntry(new UserRoleScope(RoleScopeTypes.Container, container.Id.ToString()), new UserRole(RoleNames.Owner)));
                }
            }

            return result;
        }
    }
}
