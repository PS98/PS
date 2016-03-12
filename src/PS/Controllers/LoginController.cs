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
        private IAuthService _mongoDb;
        public LoginController(IAuthService mongo)
        {
            _mongoDb = mongo;
        }

        // POST api/login
        [HttpPost]
        public string Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = _mongoDb.login(model.Email, model.Password);
                if (!string.IsNullOrEmpty(result))
                {
                    return result;
                }
            }
            return null;
        }

    }
}
