using Microsoft.Owin.Security.DataHandler.Encoder;
using Owin;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using Microsoft.Owin.Security.Jwt;
using Microsoft.Owin.Security;

namespace Api
{
    public partial class Startup
    {
        private void ConfigureAuthZero(IAppBuilder app)
        {
            var issuer = "https://" + ConfigurationManager.AppSettings["auth0:Domain"] + "/";
            var audience = ConfigurationManager.AppSettings["auth0:ClientId"];
            var secret = TextEncodings.Base64.Encode(
                TextEncodings.Base64Url.Decode(ConfigurationManager.AppSettings["auth0:ClientSecret"]));

            app.UseJwtBearerAuthentication(new JwtBearerAuthenticationOptions
            {
                AuthenticationMode = AuthenticationMode.Active,
                AllowedAudiences = new[] { audience},
                IssuerSecurityTokenProviders = new[]
                {
                    new SymmetricKeyIssuerSecurityTokenProvider(issuer, secret)
                }
            });
        }
    }
}