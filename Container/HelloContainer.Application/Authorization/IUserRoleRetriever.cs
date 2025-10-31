namespace HelloContainer.Application.Authorization
{
    public interface IUserRoleRetriever
    {
        Task<IEnumerable<UserRoleLookupEntry>> Retrieve(Guid userId);
    }

    public record UserRoleLookupEntry(UserRoleScope LookupScope, UserRole[] LookupResult);

    public record UserRoleScope(string Scope, string ScopeRef)
    {
        public virtual bool Equals(UserRoleScope? other)
        {
            return other != null && other.Scope == Scope && other.ScopeRef == ScopeRef;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Scope, ScopeRef);
        }
    }

    public record UserRole(UserRoleScope SourceScope, string RoleName);
}


