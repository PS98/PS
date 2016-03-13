using Microsoft.AspNet.Mvc;
using PS.Services;
using PS.ViewModels.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AuthController : Controller
    {
        private IAuthService _mongoDb;
        public AuthController(IAuthService mongo)
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

        // POST api/register
        [HttpPost]
        public string Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = _mongoDb.register(model.Username, model.Email, model.Password);
                return result;
            }
            return null;
        }

    }
}
