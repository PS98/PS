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
        private IMongoRepository _mongoDb;

        public HomeController(IEmailSender mail, IMessageBoardRepository repo, ILoggerFactory logger, IMongoRepository mongo)
        {
            _mail = mail;
            _repo = repo;
            _logger = logger;
            _mongoDb = mongo;
        }

        public IActionResult Index()
            
        {
            // _mongoDb.getAll();
            // _mongoDb.getSelected("56dc1f6548099944c774a0fb");
           // _mongoDb.insert();
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
