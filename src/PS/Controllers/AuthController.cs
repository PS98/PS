using Api;
using Api.Client;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.OptionsModel;
using Newtonsoft.Json;
using PS.Services;
using PS.ViewModels.Account;
using RestSharp.Extensions.MonoHttp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace PS.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AuthController : Controller
    {
        private readonly IAuthService _auth;
        private readonly IEmailSender _emailSender;
        private static Oauth2LoginContext _context;
        public AuthSocialLoginOptions Options { get; }

        public AuthController(IAuthService auth, IEmailSender emailSender, IOptions<AuthSocialLoginOptions> optionsAccessor)
        {
            _auth = auth;
            _emailSender = emailSender;
            Options = optionsAccessor.Value;
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

        // POST api/auth/ForgotPassword
        [HttpPost]
        public JsonResult ForgotPassword(ForgotPasswordViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (_auth.forgotPassword(model))
                    {
                        var pass = RandomString(8);
                        //var callbackUrl = Url.Action("ForgotPassword", "Auth", new { userId = model.Email, code = pass }, protocol: HttpContext.Request.Scheme);
                        _emailSender.SendSimpleMessage(model.Email, "Reset Password",
                           "Your New Password is: " + pass);
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "Mail sent successfully." });
                    }
                    else
                    {
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "Email address not registered with us." });
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

        private static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        #region Social Login
        public ActionResult SocialLogin(string id = "", string bindpage = "")
        {
            string url = "";
            AbstractClientProvider client = null;
            try
            {
                switch (id.ToLower())
                {
                    case "google":
                        client = Oauth2LoginFactory.CreateClient<GoogleClinet>(Options.google.ClientId, Options.google.ClientSecret, Options.google.CallbackUrl, Options.google.Scope, Options.AcceptedRedirectUrl, Options.FailedRedirectUrl, Options.google.Proxy);
                        break;
                    case "facebook":
                        client = Oauth2LoginFactory.CreateClient<FacebookClient>(Options.facebook.AppId, Options.facebook.AppSecret, Options.facebook.CallbackUrl, Options.facebook.Scope, Options.AcceptedRedirectUrl, Options.FailedRedirectUrl, Options.facebook.Proxy);
                        break;
                    default:
                        return RedirectToAction("index");
                }
                if (client != null)
                {
                    if (bindpage.Equals("1"))
                        client.CallBackUrl += "?bindpage=1";
                    _context = Oauth2LoginContext.Create(client);
                    url = _context.BeginAuth();
                }
            }
            catch (Exception)
            {
                throw;
            }

            return Json(new { Url = url });
        }

        public ActionResult Success(string code)
        {
            try
            {
                var token = _context.RequestToken(code);
                var result = _context.RequestProfile(token);
                var strResult = _context.Client.ProfileJsonString;
                //if (email != "")
                //    result.Add("email", email);

                return Content("<script type=\"text/javascript\">window.opener.abc('" + JsonConvert.SerializeObject(strResult) + "');self.close();</script>");
            }
            catch (Exception ex)
            {
                throw ex;
                //RedirectToAction("Error");
            }
        }

        public ActionResult Error()
        {
            return View();
        }

        #region twitter
        //public ActionResult Twitter(FormCollection from)
        //{
        //    if (string.IsNullOrEmpty(from["useremail"]))
        //    {
        //        return View();
        //    }

        //    string url = "";

        //    try
        //    {

        //        var client = MultiOAuthFactroy.CreateClient<TwitterClient>("Twitter");
        //        client.CallBackUrl += "?email=" + from["useremail"];
        //        _context = MultiOAuthContext.Create(client);
        //        url = _context.BeginAuth();

        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //    return Redirect(url);
        //}
        #endregion
        #endregion
    }
}
