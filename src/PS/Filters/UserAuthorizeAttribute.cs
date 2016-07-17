using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc.Filters;
using PS.DTO;
using PS.Services;
using System.Linq;

namespace PS.Filters
{
    public class MmAuthorizeAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            byte[] res;
            const string key = "XSRF-TOKEN";
            const string database = "userSessionDetails";
            const string collectionName = "TokenDetails";
            var repo = new MongoRepository(database);

            Microsoft.Extensions.Primitives.StringValues clientToken;
            filterContext.HttpContext.Request.Headers.TryGetValue("X-XSRF-TOKEN", out clientToken);
            var clientAuthToken = !string.IsNullOrWhiteSpace(clientToken) ? clientToken[0] : "";
            filterContext.HttpContext.Session.TryGetValue(key, out res);
            if (res == null)
            {
                var data = repo.GetDocumentList<UserSession>(collectionName);
                if (data.All(r => r.Token != clientAuthToken))
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
                var result = System.Text.Encoding.UTF8.GetString(res);
                if (result.ToString() == clientAuthToken.ToString()) return;
                filterContext.HttpContext.Response.Clear();
                filterContext.HttpContext.Response.StatusCode = 203;
            }
        }
    }
}
