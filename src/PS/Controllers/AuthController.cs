using PS.Api;
using PS.Api.Client;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.OptionsModel;
using Newtonsoft.Json;
using PS.Services;
using PS.Models;
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
        private IMongoRepository _mongoDb;
        private MongoRepository repo;

        public AuthController(IAuthService auth, IEmailSender emailSender, IOptions<AuthSocialLoginOptions> optionsAccessor)
        {
            _auth = auth;
            _emailSender = emailSender;
        //    _mongoDb = mongoDb;
          //  this.repo = repo;
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
                    if (result != null)
                    {
                        if(string.IsNullOrEmpty(result[1]))
                        {
                            Response.StatusCode = (int)HttpStatusCode.OK;
                            return Json(new { Message = "You Entered Incorrect Password.", Status = 1 });
                        }
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Result = result, Status = 0 });
                    }
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Message = "Email address Not Registered.", Status = 1 });
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message, Status = 2 });
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "System doesn't support entered data format", ModelState = ModelState, Status = 2 });
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
                        return Json(new { Message = "Your email address already registered with us.", Status = result });
                    }
                    else
                    {
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "Error while processing your request. Please try again later.", Status = result });
                    }
                    
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "System doesn't support entered data format", Status = 2 });
        }

        // POST api/auth/ForgotPassword
        [HttpPost]
        public JsonResult ForgotPassword(ForgotPasswordViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var pass = _auth.forgotPassword(model);
                    if (pass != null)
                    {
                        //var callbackUrl = Url.Action("ForgotPassword", "Auth", new { userId = model.Email, code = pass }, protocol: HttpContext.Request.Scheme);
                        _emailSender.SendSimpleMessage(model.Email, "Reset Password",
                           "Your New Password is: " + pass);
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "Password has been sent to registered email address.", Status = 0 });
                    }
                    else
                    {
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "Your email address is not registered with us.", Status = 1 });
                    }
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "System doesn't support entered data format", Status = 2 });
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

        public JsonResult Success(string code)
        {
            try
            {
                var token = _context.RequestToken(code);
                var result = _context.RequestProfile(token);
               //var strResult = _context.Client.ProfileJsonString;
               

                var operation = _auth.SocialLogin(result);


                return Json(new { Result = operation });
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
