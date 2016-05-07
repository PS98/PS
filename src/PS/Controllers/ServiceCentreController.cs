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
        private MongoRepository repo = new MongoRepository("serviceCentre");
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
        public IEnumerable<Centre> Get([FromBody] SelectedService selectedService)
        {
            var collection = repo.GetCollection<ServiceCentre>(selectedService.City);
            // var filter = Builders<BsonDocument>.Filter.Eq("area", selectedService.Area);
            var documentList = collection?.Find(new BsonDocument()).ToListAsync().Result;
            //var result = await collection.Find(filter).ToListAsync();
            // get document by area
            var list = documentList?.Where(x => x.Area.ToLower() == selectedService.Area.ToLower());
            if (list == null) return null;

            // select first because one area will have one document
            var centreList = list.First().Centres;

            // if no service selected then display all service centre list
            if (selectedService.Name.Count == 0)
                return centreList;

            // select only those which are providing all selected services;

            var selectedCentres = new List<Centre>();
            foreach (var centre in centreList)
            {
                var price = new List<int>();
                var serviceDetails = new List<ServiceDetails>();
                // check if centre is providing all user selected service
                if (selectedService.Name.All(x => centre.ServiceDetails.Any(y => y.Name.Trim().ToLower() == x.Trim().ToLower())))
                {

                    foreach (var abc in centre.ServiceDetails)
                    {
                        if (selectedService.Name.Contains(abc.Name.Trim()))
                        {
                            if (!string.IsNullOrEmpty(selectedService.Varient))
                            {
                                price.AddRange(abc.PriceDetails.Where(x => x.ModelList.Contains(selectedService.Model) && x.VarientList.Any(a => a.Varient.Contains(selectedService.Varient))).Select(a => a.VarientList.First().Price));
                            }
                            else
                            {
                                price.AddRange(abc.PriceDetails.Where(x => x.ModelList.Contains(selectedService.Model)).Select(x => x.Price));
                            }
                            serviceDetails.Add(new ServiceDetails { Name = abc.Name, Price = price[price.Count - 1] });
                        }
                    }
                    
                    if (selectedService.Name.Count == price.Count)
                        selectedCentres.Add(new Centre
                        {
                            Name = centre.Name,
                            Address = centre.Address,
                            Latitude = centre.Latitude,
                            Longitude = centre.Longitude,
                            PhoneNo = centre.PhoneNo,
                            TotalPrice = price.Sum(),
                            ServiceDetails = serviceDetails

                        });

                }

            }

            return selectedCentres;

        }
        // POST api/values
        [HttpPost]
        [Route("save")]
        public void Post([FromBody]ServiceCentre value)
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
