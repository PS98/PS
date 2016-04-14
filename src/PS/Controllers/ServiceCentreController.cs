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
        [HttpPost]
        [Route("centerlist")]
        public IEnumerable<Centre> Get(SelectedService selectedService)
        {
            var collection = repo.GetCollection<ServiceCentre>(selectedService.City);
            var documentList = collection?.Find(new BsonDocument()).ToListAsync().Result;
            // get document by area
            var list =  documentList?.Where(x=>x.Area.ToLower() == selectedService.Area.ToLower());
            if (list == null) return null;

            // select fist because one area will have one document
            var centreList = list.First().Centres;

            // if no service selected then display all service centre list
            if (selectedService.Name.Count == 0)
                return centreList;

            // select only those which are providing all selected services;

            var selectedCentres = new List<Centre>();

            foreach (var a in centreList)
            {
                var count = 0;
                foreach (var service in selectedService.Name)
                {
                    if (a.ServiceList !=null && !a.ServiceList.Contains(service))
                        break;
                    count++;
                    if (selectedService.Name.Count == count)
                    {
                        selectedCentres.Add(a);
                    }
                }

            }

            return selectedCentres;

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
