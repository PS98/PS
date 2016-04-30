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
        private readonly ISmsSender _smsSender;
        private IPaymentProcessor _paymentProcessor;

        public AuthController(IAuthService auth, IEmailSender emailSender, ISmsSender smsSender, IPaymentProcessor paymentProcessor, IOptions<AuthSocialLoginOptions> optionsAccessor)
        {
            _auth = auth;
            _emailSender = emailSender;
            _smsSender = smsSender;
            _paymentProcessor = paymentProcessor;
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
            return Json(new { Message = "We are unable to process your request.", ModelState = ModelState, Status = 2 });
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
                    var result = _auth.register(model);                    
                    if(result[0] == "0")
                    {
                        Response.StatusCode = (int)HttpStatusCode.Created;
                        return Json(new { Message = "User registered Successfully.", Result = result, Status = 0 });
                    }
                    else if(result[0] == "1")
                    {
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "Your email address already registered with us.", Status = 1 });
                    }
                    else
                    {
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "Error while processing your request. Please try again later.", Status = 2 });
                    }
                    
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "We are unable to process your request.", Status = 2 });
        }


        // POST api/auth/register
        // result = 0 : Success
        // result = 1 : Already Registered
        // result = 2 : Error
        [HttpPost]
        public JsonResult Subscribe(SubscribeViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (model.Created == default(DateTime))
                    {
                        model.Created = DateTime.UtcNow;
                    }
                    int result = _auth.SubcribeUser(model);
                    if (result == 0)
                    {
                        Response.StatusCode = (int)HttpStatusCode.Created;
                        return Json(new { Message = "User subscribed Successfully.", Status = result });
                    }
                    else if (result == 1)
                    {
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "Your email address already subscribed with us.", Status = result });
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
            return Json(new { Message = "We are unable to process your request.", Status = 2 });
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
            return Json(new { Message = "We are unable to process your request.", Status = 2 });
        }

        // POST api/auth/MobileOTP
        [HttpPost]
        public JsonResult MobileOTP(MobileOTPViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var pass = RandomString(4);
                    if (pass != null)
                    {
                        _smsSender.SendSmsAsync(model.MobileNumber, "Your One Time Password is: " + pass);
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Result = pass, Message = "OTP generated successfully.", Status = 0 });
                    }
                    else
                    {
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "Error in OTP generation. Please try again later.", Status = 1 });
                    }
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "We are unable to process your request.", Status = 2 });
        }


        [HttpPost]
        public JsonResult UpdateProfile(UpdateUserProfileViewModel changeModel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var result = _auth.updateProfile(changeModel);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    if (result.Equals("S"))
                    {
                        return Json(new { Result = "Your Details updated successfully", Status = 1 });
                    }
                    else
                    {
                        return Json(new { Result = "Could not update Details", Status = 2 });

                    }

                }
                else
                {
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Result = "Please fill All Required Details", Status = 3 });
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
            }

        }



        [HttpPost]
        public JsonResult ChangePassword(ChangePasswordViewModel changeModel)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var result = _auth.changePassword(changeModel);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    if (result.Equals("S"))
                    {
                        return Json(new { Result = "Your password updated successfully", Status = 1 });
                        }
                    else
                    {
                        return Json(new { Result = "Old password doesn't match", Status = 2 });

                        }

                }
                else
                {
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Result = "Please fill All Required Details",Status=3 });
                } 
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
            }
          
        }
        private static string RandomString(int length)
        {
            const string chars = "0123456789";
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

        public JsonResult Feedback(FeedbackModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var message = model.FirstName + " " + model.LastName + "<br />Contact Number: " + model.Mobile + 
                        "provided feedback regarding MileMates services.<br /><br />" + model.Message;
                    _emailSender.SendSimpleMessage("feedback@milemates.com", model.Subject, message);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Message = "Your message has been submitted successfully.", Status = 0 });
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "We are unable to process your request.", Status = 1 });
        }

        public JsonResult ProcessPayment(PaymentDetailsModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var res = _paymentProcessor.OrderPayment(model.name, model.purpose, model.amount, model.email, model.phone, model.send_email, model.send_sms);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    var data = JsonConvert.DeserializeAnonymousType(res.Content, new PaymentResponseModel());
                    return Json(new {Status = 0, Result = data });
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "We are unable to process your request.", Status = 1 });
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
