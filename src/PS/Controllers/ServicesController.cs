using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using PS.Services;
using PS.Models;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PS.Controllers
{
    [Route("api/[controller]")]
    public class ServicesController : Controller
    {
        private MongoRepository repo = new MongoRepository("services");

        // GET: api/values
        [HttpGet]
        
        public List<string> Get()
        {
            // return new string[] { "value1", "value2" };

            var coll = repo.GetAllCollectionName();

            return new List<string>();
        }



        [HttpGet(("all"))]
        [Route("all")]
        public List<IEnumerable<Models.Services>> GetAll()
        {
           // return new string[] { "value1", "value2" };

          var commonServices =  repo.GetDocumentList<Models.Services>("Common Services");
          var repairServices = repo.GetDocumentList<Models.Services>("Repair & Maintenance");
           var scheduleServices = repo.GetDocumentList<Models.Services>("Scheduled Maintenance");
            List<IEnumerable<Models.Services>> listAll = new List<IEnumerable<Models.Services>>();
            listAll.Add(commonServices);
            listAll.Add(repairServices);
            listAll.Add(scheduleServices);

            return listAll;
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
