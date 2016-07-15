using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc.Filters;
using Newtonsoft.Json;
using PS.DTO;
using PS.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Filters
{
    public class MmAuthorizeAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            byte[] res;
            string key = "XSRF-TOKEN";
            string Database = "UserSessionDetails";
            MongoRepository _repo = new MongoRepository(Database);
            string CollectionName = "TokenDetails";
            Microsoft.Extensions.Primitives.StringValues clientToken;
            filterContext.HttpContext.Request.Headers.TryGetValue("X-XSRF-TOKEN", out clientToken);
            var clientAuthToken = clientToken[0];
            filterContext.HttpContext.Session.TryGetValue(key, out res);
            if (res == null)
            {
                var data = _repo.GetDocumentList<UserSession>(CollectionName);
                if (!data.Any(r => r.Token == clientAuthToken))
                {
                    filterContext.HttpContext.Response.Clear();
                    filterContext.HttpContext.Response.StatusCode = 203;
                }
                else
                {
                    filterContext.HttpContext.Session.SetString(key, clientAuthToken);
                }
            }
            else
            {
                string result = System.Text.Encoding.UTF8.GetString(res);
                if (result.ToString() != clientAuthToken.ToString())
                {
                    filterContext.HttpContext.Response.Clear();
                    filterContext.HttpContext.Response.StatusCode = 203;
                }
            }
        }
    }
}
