namespace HelloContainer.Application.Authorization
{
    public class UserRolesRetriever : IUserRoleRetriever
    {
        public async Task<IEnumerable<UserRoleLookupEntry>> Retrieve(Guid userId)
        {
            var userRoles = new List<UserRoleLookupEntry>
            {
                new UserRoleLookupEntry(
                    new UserRoleScope("workspace", "196a8ff4-dfbc-4ee7-ae08-4f38b84d9c86"),
                    [
                        new UserRole(new UserRoleScope("workspace",  "196a8ff4-dfbc-4ee7-ae08-4f38b84d9c86"), "reader")
                    ]
                )
            };

            return await Task.FromResult(userRoles);
        }
    }
}
