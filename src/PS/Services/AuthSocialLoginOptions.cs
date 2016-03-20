using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Services
{
    public class AuthSocialLoginOptions
    {
        public Facebook facebook {get; set;}
        public Google google { get; set; }
        public string AcceptedRedirectUrl { get; set; }
        public string FailedRedirectUrl { get; set; }
    }

    public class Facebook
    {
        public string AppId { get; set; }
        public string AppSecret { get; set; }
        public string CallbackUrl { get; set; }
        public string Proxy { get; set; }
        public string Scope { get; set; }
    }

    public class Google
    {
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public string CallbackUrl { get; set; }
        public string Proxy { get; set; }
        public string Scope { get; set; }
    }
}
