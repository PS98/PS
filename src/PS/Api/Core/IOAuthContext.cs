using System;
using System.Collections.Generic;

namespace PS.Api
{
    public interface IOAuthContext
    {
        AbstractClientProvider Client { get;set;}
        IClientService Service { get; set; }
        
        string BeginAuth();
    }
}
