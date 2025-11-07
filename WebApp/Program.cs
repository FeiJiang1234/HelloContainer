using HelloContainer.WebApp.Extensions;
using HelloContainer.WebApp.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<ContainerApiClient>(client =>
{
    client.BaseAddress = new Uri("https://localhost:7054");
});

// 使用自定义 OIDC 配置
builder.Services.AddOidc(options =>
{
    builder.Configuration.GetSection("Oidc").Bind(options);
});

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapRazorPages();

app.Run();

