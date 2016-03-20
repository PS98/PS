using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Web;

namespace Api
{
    public class Oauth2LoginContext : IOAuthContext
    {
        private const string _sessionKey = "Oauth2LoginContext";
        private const string _cookieKey = "Oauth2LoginCookie";

        public AbstractClientProvider Client { get; set; }
        public IClientService Service { get; set; }

        public Oauth2LoginContext()
        {
        }

        public Oauth2LoginContext(AbstractClientProvider oClient)
        {
            if (oClient != null)
            {
                Client = oClient;
                Service = (IClientService)Activator.CreateInstance(Client.ServiceType, new object[] { Client });
                
              //  HttpContext.Current.Session.Add(_sessionKey, this);
                HttpCookie oauthCookie = new HttpCookie(_cookieKey);
                oauthCookie["configuration"] = Client.GetType().Name.Replace("Client", "");
                oauthCookie.Expires = DateTime.Now.AddHours(1);
              //  HttpContext.Current.Request.Cookies.Add(oauthCookie);
            }
            else
                throw new Exception("ERROR: [Oauth2LoginContext] Client is not found!");
        }

        public static Oauth2LoginContext Create(AbstractClientProvider oClient)
        {
            return new Oauth2LoginContext(oClient);
        }

        public string BeginAuth()
        {
            return Service.BeginAuthentication();
        }

        public dynamic RequestToken(string code)
        {
            string result = Service.RequestToken(code);
            if (result != "access_denied")
            {
                Client.Token = result;
                return Client.Token;
            }
            else {
                HttpContext.Current.Response.Redirect(Client.FailedRedirectUrl);
                return false;
            }

        }

        public dynamic RequestProfile(string code)
        {
            Dictionary<string, string> result = Service.RequestUserProfile(code);
            if (result != null)
            {
                Client.Profile = result;
                return Client.Profile;
            }
            else {
                throw new Exception("ERROR: [Oauth2LoginContext] Profile is not found!");
            }
        }

    }
}
