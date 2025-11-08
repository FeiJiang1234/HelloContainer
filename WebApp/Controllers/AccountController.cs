using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HelloContainer.WebApp.Controllers
{
    [AllowAnonymous]
    public class AccountController : Controller
    {
        /// <summary>
        /// 登录
        /// </summary>
        public IActionResult SignIn()
        {
            return Challenge(new AuthenticationProperties 
            { 
                RedirectUri = Url.Action("Index", "Home") 
            }, OpenIdConnectDefaults.AuthenticationScheme);
        }

        /// <summary>
        /// 注销
        /// </summary>
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            
            return SignOut(new AuthenticationProperties 
            { 
                RedirectUri = Url.Action("Index", "Home") 
            }, OpenIdConnectDefaults.AuthenticationScheme);
        }
    }
}