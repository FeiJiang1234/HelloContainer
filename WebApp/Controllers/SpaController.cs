using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HelloContainer.WebApp.Controllers
{
    [Authorize]
    public class SpaController : Controller
    {
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            string file = Directory.GetCurrentDirectory();
            file = Path.Combine(file, "ClientApp/dist/index.html");
            return PhysicalFile(file, "text/html");
        }
    }
}
