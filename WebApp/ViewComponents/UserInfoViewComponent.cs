using HelloContainer.WebApp.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HelloContainer.WebApp.ViewComponents
{
    public class UserInfoViewComponent : ViewComponent
    {
        private readonly UserApiClient _userApiClient;

        public UserInfoViewComponent(UserApiClient userApiClient)
        {
            _userApiClient = userApiClient;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
            {
                return Content(string.Empty);
            }

            var claimsPrincipal = User as ClaimsPrincipal;
            var userIdClaim = claimsPrincipal?.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
            
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return View("Default", new UserInfoViewModel 
                { 
                    DisplayName = User.Identity?.Name ?? "User",
                    Role = null
                });
            }

            var user = await _userApiClient.GetUserByIdAsync(userId);
                
            return View("Default", new UserInfoViewModel
            {
                DisplayName = user?.name ?? User.Identity?.Name ?? "User",
                Role = user?.role
            });
        }
    }

    public class UserInfoViewModel
    {
        public string DisplayName { get; set; } = string.Empty;
        public string? Role { get; set; }
    }
}