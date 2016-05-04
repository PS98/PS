using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using PS.Models;
using PS.Services;
using System.Net;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PS.Controllers
{
    [Route("api/[controller]")]
    public class OrderDetailsController : Controller
    {
        private MongoRepository repo = new MongoRepository("orders");
        // GET: api/values
        [Route("order")]
        //[HttpGet("{email}/{status}")]
        public JsonResult Get(string email,string status)
        {
            try
            {
                if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(status))
                {
                    var res = repo.GetOrderOnStatus(status,email);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Status = 0, Result = res });
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "We are unable to process your request.", Status = 1 });
           // return new List<OrderDetails>();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
