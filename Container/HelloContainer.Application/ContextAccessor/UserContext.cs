using Microsoft.AspNetCore.Http;

public class UserContext
{
    public string? UserId { get; set; }

    public string? UserName { get; set; }

    public static (bool, UserContext? userContext) ParseFromHttpContextOnEntryPoint(HttpContext context)
    {
        var userContext = new UserContext();
        return ParseFromHttpContext(userContext, context) ? (true, userContext) : (false, null);
    }

    public static bool ParseFromHttpContext(UserContext userContext, HttpContext context)
    {
        if (!(context.User.Identity?.IsAuthenticated ?? false))
            return false;

        userContext.UserId = context.User.FindFirst("sub")?.Value;
        userContext.UserName = context.User.FindFirst("name")?.Value;
        return true;
    }
}
