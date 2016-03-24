using System;
using System.Collections.Generic;

namespace Api
{
    public interface IClientService
    {
        void CreateOAuthClient(IOAuthContext oContext);
        void CreateOAuthClient(AbstractClientProvider oClient);
        
        string BeginAuthentication();
        string RequestToken(string code);
        object RequestUserProfile(string code);
    }
}
