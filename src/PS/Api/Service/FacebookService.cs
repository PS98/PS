using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Web;
using PS.Api.Client;
using PS.Api.Core;
using PS.Api.Model;
using Newtonsoft.Json;
using RestSharp.Extensions.MonoHttp;

namespace PS.Api.Service
{
    public class FacebookService : IClientService
    {
        private static string _oauthUrl = "";
        private AbstractClientProvider _client;

        public FacebookService()
        {
        }

        public FacebookService(AbstractClientProvider oCleint)
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
                _oauthUrl = string.Format("https://www.facebook.com/dialog/oauth?" +
                                "client_id={0}&redirect_uri={1}&state={2}&display=popup",
                                _client.ClientId,
                                HttpUtility.HtmlEncode(_client.CallBackUrl),
                                "");
                return _oauthUrl;
            }
            throw new Exception("ERROR: BeginAuth the cleint not found!");
        }

        public string RequestToken(string token)
        {
            if (token != null)
            {
                string tokenUrl = string.Format("https://graph.facebook.com/oauth/access_token?");
                string post = string.Format("client_id={0}&redirect_uri={1}&client_secret={2}&code={3}",
                                            _client.ClientId,
                                            HttpUtility.HtmlEncode(_client.CallBackUrl),
                                            _client.ClientSecret,
                                            token);
                string resonseJson = RestfullRequest.Request(tokenUrl, "POST", "application/x-www-form-urlencoded", 
                                                                                        null, post, _client.Proxy);
                resonseJson = "{\"" + resonseJson.Replace("=", "\":\"").Replace("&", "\",\"") + "\"}";
                return JsonConvert.DeserializeAnonymousType(resonseJson, new { access_token = "" }).access_token;
            }
            return "access_denied";
        }

        public object RequestUserProfile(string code)
        {
            var profileUrl = string.Format("https://graph.facebook.com/me?access_token={0}&fields={1}", _client.Token, _client.Scope);
            var header = new NameValueCollection {{"Accept-Language", "en-US"}};
            var result = RestfullRequest.Request(profileUrl, "GET", "application/x-www-form-urlencoded", header,null, _client.Proxy);
            var data = JsonConvert.DeserializeAnonymousType(result, new FacebookUserProfile());

            return data;
        }
    }
} 
