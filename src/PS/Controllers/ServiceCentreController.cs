using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using PS.Models;
using PS.Services;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PS.Controllers
{
    [Route("api/[controller]")]
    public class ServiceCentreController : Controller
    {
       // private IMongoRepository _mongoDb;
        private MongoRepository repo =  new MongoRepository("serviceCentre");
        const string database = "serviceCentre";
        const string collectionName = "Pune";




       // GET: api/values
       [HttpGet]
        public IEnumerable<string> Get()
       {

           var collection = repo.GetAllCollectionName();

           return collection;
        }

        // GET api/values/5
        [HttpGet("{city}")]
        public IEnumerable<string> Get(string city)
        {

            
            var collection = repo.GetCollection<ServiceCentre>(city);

            var areaList = collection?.Find(new BsonDocument()).ToListAsync().Result;

            return areaList.Select(x => x.Area).Distinct();
        }

        [HttpPost("{city}/{area}")]
        public IEnumerable<Centre> Get(string city, string area, [FromUri] string[] serviceList)
        {
            var collection = repo.GetCollection<ServiceCentre>(city);

            var documentList = collection?.Find(new BsonDocument()).ToListAsync().Result;

            var list =  documentList?.Where(x=>x.Area.ToLower() == area.ToLower());

            var centreList = new List<Centre>();
            if (list == null) return centreList;
            foreach (var a in list)
            {
                foreach (var service in serviceList)
                {
                    centreList.AddRange(a.Centres.Where(x => x.ServiceList.Contains(service)));
                }
            }

            return centreList;

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
