namespace HelloContainer.WebApp.Extensions
{
    public class OAuth2Options
    {
        public string Authority { get; set; } = "https://login.veracity.com/tfp/a68572e3-63ce-4bc1-acdc-b64943502e9d/b2c_1a_signinwithadfsidp/v2.0";

        public string ClientId { get; set; }

        public string ClientSecret { get; set; }

        public string[] Scopes { get; set; }

        public string CallbackPath { get; set; } = "/signin-oidc";
    }
}
