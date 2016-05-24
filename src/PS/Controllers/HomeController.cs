using Microsoft.AspNet.Mvc;
using PS.Models;
using PS.Services;
using Microsoft.AspNet.Authorization;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace PS.Controllers
{
    [RequireHttps]
    public class HomeController : Controller
    {
        private IEmailSender _mail;
        private ILoggerFactory _logger;
       

        public HomeController(IEmailSender mail, ILoggerFactory logger)
        {
            _mail = mail;
            _logger = logger;  
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
