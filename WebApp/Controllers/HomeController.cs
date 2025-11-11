using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HelloContainer.WebApp.Services;

namespace HelloContainer.WebApp.Controllers;

[Authorize]
public class HomeController : Controller
{
    private readonly ContainerApiClient _containerApiClient;
    private readonly UserApiClient _userApiClient;
    private readonly ILogger<HomeController> _logger;

    public HomeController(ContainerApiClient containerApiClient, ILogger<HomeController> logger, UserApiClient userApiClient)
    {
        _containerApiClient = containerApiClient;
        _logger = logger;
        _userApiClient = userApiClient;
    }

    public async Task<IActionResult> Index(string? searchKeyword)
    {
        var containers = await _containerApiClient.GetContainersAsync(searchKeyword);
        await SetCreatedBy(containers);

        ViewBag.SearchKeyword = searchKeyword;
        return View(containers ?? new List<ContainerDto>());
    }

    private async Task SetCreatedBy(List<ContainerDto>? containers)
    {
        var userIds = containers.Select(x => x.CreatedBy).ToHashSet();
        var selectUserTasks = userIds.Select(id => _userApiClient.GetUserByIdAsync(id));
        var users = await Task.WhenAll(selectUserTasks);

        foreach (var c in containers)
        {
            c.CreatedByName = users.First(x => x.id == c.CreatedBy).name;
        }
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(CreateContainerDto model)
    {
        if (!ModelState.IsValid)
        {
            TempData["Error"] = "Invalid container data. Please check your input.";
            return RedirectToAction(nameof(Index));
        }

        var container = await _containerApiClient.CreateContainerAsync(model);
        TempData["Success"] = "Container created successfully!";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AddWater(Guid id, double amount)
    {
        await _containerApiClient.AddWaterAsync(id, amount);
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _containerApiClient.DeleteContainerAsync(id);
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Connect(Guid sourceId, Guid targetId)
    {
        await _containerApiClient.ConnectContainersAsync(sourceId, targetId);
        TempData["Success"] = "Containers connected successfully!";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Disconnect(Guid sourceId, Guid targetId)
    {
        await _containerApiClient.DisconnectContainersAsync(sourceId, targetId);
        TempData["Success"] = "Containers disconnected successfully!";
        return RedirectToAction(nameof(Index));
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View();
    }
}

