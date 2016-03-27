
namespace PS.Api.Client
{
    public class FacebookClient : AbstractClientProvider
    {
         public FacebookClient()
        {
        }

         public FacebookClient(string oClientid, string oClientsecret, string oCallbackUrl, string oScope,
                                 string oAcceptedUrl, string oFailedUrl, string oProxy)
            : base(oClientid, oClientsecret, oCallbackUrl, oScope, oAcceptedUrl, oFailedUrl, oProxy)
        {
            ServiceType = typeof (Api.Service.FacebookService);
        }

        
    }
}
