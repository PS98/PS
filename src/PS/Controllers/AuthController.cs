using Microsoft.AspNet.Mvc;
using PS.Services;
using PS.ViewModels.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace PS.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AuthController : Controller
    {
        private IAuthService _auth;
        public AuthController(IAuthService auth)
        {
            _auth = auth;
        }

        // POST api/auth/login
        [HttpPost]
        public JsonResult Login(LoginViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var result = _auth.login(model);
                    if (!string.IsNullOrEmpty(result))
                    {
                        if(result == "Incorrect Password")
                        {
                            Response.StatusCode = (int)HttpStatusCode.OK;
                            return Json(new { Message = "You Entered Incorrect Password." });
                        }
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Result = result });
                    }
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Message = "Email address Not Registered." });
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json(new { Message = "Failed", ModelState = ModelState });
        }

        // POST api/auth/register
        // result = 0 : Success
        // result = 1 : Already Registered
        // result = 2 : Error
        [HttpPost]
        public JsonResult Register(RegisterViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (model.Created == default(DateTime))
                    {
                        model.Created = DateTime.UtcNow;
                    }
                    int result = _auth.register(model);
                    if(result == 0)
                    {
                        Response.StatusCode = (int)HttpStatusCode.Created;
                        return Json(new { Message = "User registered Successfully.", Status = result });
                    }
                    else if(result == 1)
                    {
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "User already registered.", Status = result });
                    }
                    else
                    {
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "Error while processing request.", Status = result });
                    }
                    
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json(new { Message = "Failed", ModelState = ModelState });
        }

    }
}
