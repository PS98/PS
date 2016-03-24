using System;

namespace Api.Client
{
    public class GoogleClinet : AbstractClientProvider
    {
         public GoogleClinet()
        {
        }

         public GoogleClinet(string oClientid, string oClientsecret, string oCallbackUrl, string oScope,
                                 string oAcceptedUrl, string oFailedUrl, string oProxy)
            : base(oClientid, oClientsecret, oCallbackUrl, oScope, oAcceptedUrl, oFailedUrl, oProxy)
        {
            ServiceType = typeof (Api.Service.GoogleService);
        }
       
    }
}
