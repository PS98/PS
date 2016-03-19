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

        public string Token
        {
            get
            {
                if (string.IsNullOrEmpty(Client.Token))
                    RequestToken();
                return Client.Token;
            }
            set { Client.Token = value; }
        }
        public Dictionary<string, string> Profile
        {
            get
            {
                if (Client.Profile == null)
                    RequestProfile();
                return Client.Profile;
            }
            set { Client.Profile = value; }
        }

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

        private void RequestToken()
        {
            string result = Service.RequestToken();
            if (result != "access_denied")
                Client.Token = result;
            else
                HttpContext.Current.Response.Redirect(Client.FailedRedirectUrl);

        }

        private void RequestProfile()
        {
            Dictionary<string, string> result = Service.RequestUserProfile();
            if (result != null)
                Client.Profile = result;
            else
                throw new Exception("ERROR: [Oauth2LoginContext] Profile is not found!");
        }

    }
}
