using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Web;
using Newtonsoft.Json;
using Api.Client;
using Api.Core;
using Api.Model;

namespace Api.Service
{
    public class GoogleService : IClientService
    {
        private static string _oauthUrl = "";
        private AbstractClientProvider _client;

        public GoogleService()
        {
        }

        public GoogleService(AbstractClientProvider oCleint)
        {
            _client = oCleint;
        }

        public void CreateOAuthClient(IOAuthContext oContext)
        {
            _client = oContext.Client;
        }

        public void CreateOAuthClient(AbstractClientProvider oClient)
        {
            _client = oClient;
        }

        public string BeginAuthentication()
        {
            if (_client != null)
            {
                _oauthUrl = string.Format("https://accounts.google.com/o/oauth2/auth?" +
                        "scope={0}&state={1}&redirect_uri={2}&client_id={3}&response_type=code&approval_prompt=auto&access_type=online",
                        HttpUtility.HtmlEncode(_client.Scope),
                        "1",
                        HttpUtility.UrlEncode(_client.CallBackUrl),
                       HttpUtility.UrlEncode(_client.ClientId));
                return _oauthUrl;
            }
            throw new Exception("ERROR: [GoogleService] BeginAuth the cleint not found!");
        }

        public string RequestToken(string code)
        {
            if (code != null)
            {
                string tokenUrl = "https://accounts.google.com/o/oauth2/token";
                string post = string.Format("code={0}&client_id={1}&client_secret={2}&redirect_uri={3}&grant_type=authorization_code",
                                          code,
                                          HttpUtility.HtmlEncode(_client.ClientId),
                                          _client.ClientSecret,
                                          HttpUtility.HtmlEncode(_client.CallBackUrl));
                string resonseJson = RestfullRequest.Request(tokenUrl, "POST", "application/x-www-form-urlencoded", null, post, _client.Proxy);
                return JsonConvert.DeserializeAnonymousType(resonseJson, new { access_token = "" }).access_token;
            }
            return "access_denied";
        }

        public object RequestUserProfile(string code)
        {
            var profileUrl = string.Format("https://www.googleapis.com/oauth2/v1/userinfo?access_token={0}", _client.Token);
            var header = new NameValueCollection {{"Accept-Language", "en_US"}};
            var result = RestfullRequest.Request(profileUrl, "GET", "application/x-www-form-urlencoded", header, null, _client.Proxy);
            var data = JsonConvert.DeserializeAnonymousType(result, new GoogleUserProfile());

            return data;
        }
    }
}
