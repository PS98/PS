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
        private IMessageBoardRepository _repo;
        private IEmailSender _mail;
        private ILoggerFactory _logger;

        public HomeController(IEmailSender mail, IMessageBoardRepository repo, ILoggerFactory logger)
        {
            _mail = mail;
            _repo = repo;
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
