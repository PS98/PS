using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        private IMongoRepository _mongoDb;
        private MongoRepository repo =  new MongoRepository();
        const string database = "serviceCentre";
        const string collectionName = "centre";


       // GET: api/values
       [HttpGet]
        public IEnumerable<string> Get()
        {

            var collection = repo.GetCollection<ServiceCentre>(collectionName, database);

            var cityList = collection?.Find(new BsonDocument()).ToListAsync().Result;

            return cityList?.Select(centre => centre.City) ?? new List<string>();
        }

        // GET api/values/5
        [HttpGet("{city}")]
        public IEnumerable<string> Get(string city)
        {
            var collection = repo.GetCollection<ServiceCentre>(collectionName, database);

            var areaList = collection?.Find(new BsonDocument()).ToListAsync().Result;

            return areaList?.Where(x => x.City.ToLower() == city.ToLower()).ToList().Select(centre => centre.Area).Distinct() ?? new List<string>();
        }
        public IEnumerable<ServiceCentre> Get(string city, string area)
        {
            var collection = repo.GetCollection<ServiceCentre>(collectionName, database);

            var collectionList = collection?.Find(new BsonDocument()).ToListAsync().Result;

            var list =  collectionList?.Where(x => x.City.ToLower() == city.ToLower() && x.Area == area).ToList();

            return list;

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
