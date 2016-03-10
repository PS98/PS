using Microsoft.AspNet.Mvc;
using PS.Services;
using PS.ViewModels.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private IMongoRepository _mongoDb;
        public LoginController(IMongoRepository mongo)
        {
            _mongoDb = mongo;
        }

        // POST api/login
        [HttpPost]
        public void Login(LoginViewModel model)
        {

        }

    }
}
