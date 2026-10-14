using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Identity;

namespace AuthApp.Pages;

public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly UserManager<IdentityUser> _userManager;

    public IndexModel(ILogger<IndexModel> logger, UserManager<IdentityUser> userManager)
    {
        _logger = logger;
        _userManager = userManager;
    }

    public string? UserEmail { get; set; }
    public bool IsAuthenticated { get; set; }

    public void OnGet()
    {
        IsAuthenticated = User.Identity?.IsAuthenticated ?? false;
        UserEmail = User.Identity?.Name;
    }
}
