namespace HelloContainer.Api.Authorization
{
    public enum ParameterBindingType
    {
        None,
        InRoute,
        InBody
    }

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public class OpaScopeDescribeAttribute : Attribute
    {
        private Type? _bindingExtractorType;

        public string? Scope { get; set; }

        public ParameterBindingType BindingType { get; set; }

        public string? BindingKey { get; set; }
    }
}
