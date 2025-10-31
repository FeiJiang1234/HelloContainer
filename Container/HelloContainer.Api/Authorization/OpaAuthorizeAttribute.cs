namespace HelloContainer.Api.Authorization
{
    [AttributeUsage(AttributeTargets.Method)]
    public class OpaAuthorizeAttribute : Attribute
    {
        public bool IncludeRequestPayloadInAuthContext { get; set; }
    }
}
