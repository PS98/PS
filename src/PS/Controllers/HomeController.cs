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

        public IActionResult CarDetails()
        {
            return View();
        }

        public IActionResult VehicleListings()
        {
            return View();
        }

        public IActionResult NewsGrid()
        {
            return View();
        }

        public IActionResult NewsDetails()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Contact page.";

            return View();
        }

        [HttpPost]
        public IActionResult Contact(ContactModel model)
        {
            ViewData["Message"] = "Your contact page.";
            var msg = $"Name:{model.Name}, Email: {model.Email}, Website: {model.Website}, Comment: {model.Comment}";
            if(_mail.SendSimpleMessage("dummy", "Feedback", msg).StatusCode.ToString() == "OK")
            {
                ViewBag.MailSent = true;
            }
            return View();
        }

        [Authorize]
        public IActionResult Messages()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
