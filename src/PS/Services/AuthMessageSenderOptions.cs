using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Services
{
    public class AuthMessageSenderOptions
    {
        public string MessageSid { get; set; }
        public string MessageBaseUri { get; set; }
        public string EmailApiKey { get; set; }
        public string EmailDomain { get; set; }
        public string EmailBaseUri { get; set; }
        public string EmailFrom { get; set; }
        public Payment payment { get; set; }
    }

    public class Payment
    {
        public string XApiKey { get; set; }
        public string XAuthToken { get; set; }
        public string BaseUrl { get; set; }
        public string RedirectUrl { get; set; }
    }
}
