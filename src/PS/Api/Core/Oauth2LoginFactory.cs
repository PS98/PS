using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;

namespace PS.Api
{
    public class Oauth2LoginFactory
    {
        public static T CreateClient<T>(string oClientId, string oClientSecret, string oCallbackUrl, string oScope,
                                        string oAcceptedUrl, string oFailedUrl, string oProxy) where T : AbstractClientProvider, new()
        {
            T client = (T)Activator.CreateInstance(typeof(T), new object[] { 
                                                        oClientId,
                                                        oClientSecret,
                                                        oCallbackUrl,
                                                        oScope,
                                                        oAcceptedUrl,
                                                        oFailedUrl,
                                                        oProxy});
            return client;
        }
    }
}
