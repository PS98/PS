using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.Filters;
using PS.DTO;
using PS.Models;
using PS.Services;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PS.Controllers
{
    public class BaseController : Controller
    {
        public UserSession userDetails;
        const string key = "XSRF-TOKEN";
        byte[] res;
        const string database = "userSessionDetails";
        const string collectionName = "TokenDetails";
        public override void OnActionExecuting(ActionExecutingContext context)
        {

            userDetails = new UserSession();
            Microsoft.Extensions.Primitives.StringValues clientToken;
            context.HttpContext.Request.Headers.TryGetValue("X-XSRF-TOKEN", out clientToken);
            if (!string.IsNullOrEmpty(clientToken))
            {
                var repo = new MongoRepository(database);
                var data = repo.GetDocumentList<UserSession>(collectionName);
                var userId = data.Find(r => r.Token == clientToken[0]).UserId;
                userDetails.UserId = userId;
                userDetails.Token = clientToken;
                repo = new MongoRepository("auth");
                var custData = repo.GetDocumentList<Customer>("customer").Find(r => r.Email == userId);
                if (custData != null)
                    userDetails.CentreId = custData.CentreId;
            }
        }
    }
}
