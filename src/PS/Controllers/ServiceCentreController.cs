using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using PS.Models;
using PS.Services;
using System.Net;

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
              //  check if centre is providing all user selected service
                if (selectedService.Name.All(x => centre.ServiceDetails.Any(y => y.Name.Trim().ToLower() == x.Trim().ToLower())))
                {

                    foreach (var abc in centre.ServiceDetails)
                    {
                        if (selectedService.Name.Contains(abc.Name.Trim()))
                        {
                            if (!string.IsNullOrEmpty(selectedService.Type))
                            {
                            switch (selectedService.Type.ToLower().Trim())
                            {
                                case "petrol":
                                    price.AddRange(abc.Petrol.Where(x => x.ModelList.Contains(selectedService.Model)).Select(a => a.Price));
                                    break;
                                case "diesel":
                                    price.AddRange(abc.Diesel.Where(x => x.ModelList.Contains(selectedService.Model)).Select(a => a.Price));
                                    break;
                                case "cng":
                                    price.AddRange(abc.CNG.Where(x => x.ModelList.Contains(selectedService.Model)).Select(a => a.Price));
                                    break;
                                case "electric":
                                    price.AddRange(abc.Electric.Where(x => x.ModelList.Contains(selectedService.Model)).Select(a => a.Price));
                                    break;
                            }
                                serviceDetails.Add(new ServiceDetails { Name = abc.Name, Price = price[price.Count - 1] });

                            }

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
                            // ServiceDetails = serviceDetails

                        });

                }

            }

            return selectedCentres;

        }
        // POST api/values
        [HttpPost]
        [Route("save")]
        public JsonResult Post([FromBody]ServiceCentre serviceCentreObj)
        {
            try {
                if (!string.IsNullOrEmpty(serviceCentreObj.Area))
                {
                    var collection = repo.GetCollection<ServiceCentre>("Pune");

                    var documentList = collection?.Find(new BsonDocument()).ToListAsync().Result;
                   
                    // get document by area
                    var list = documentList?.Where(x => x.Area.ToLower() == serviceCentreObj.Area.ToLower());
                    if (!list.Any())
                    {
                        var id = repo.GenerateNewID();
                        serviceCentreObj.Centres.First().Id = id;
                        repo.insertDocument(database, collectionName, serviceCentreObj);   // if new area then insert into db
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "new doc created in DataBase", Status = 0 , Id = id });
                    }

                    // select first because one area will have one document
                    var centreList = list.First().Centres;
                    var filter = Builders<ServiceCentre>.Filter.Eq("Area", serviceCentreObj.Area);
                    var update = Builders<ServiceCentre>.Update.Set("Centres", centreList);

                    var newCentre = serviceCentreObj.Centres.First();

                    if (string.IsNullOrEmpty(newCentre.ServiceDetails.First().Name))
                    {
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "please select a service ", Status = 1 });
                    }

                    if (string.IsNullOrEmpty(newCentre.Id))  // no id then new centre 
                    {
                        var id = repo.GenerateNewID();

                        serviceCentreObj.Centres.First().Id = id;
                        centreList.Add(serviceCentreObj.Centres.First());
                        collection.UpdateOneAsync(filter, update);
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "new centre added into centreList", Status = 0 ,Id = id });
                    }

                    var exitingCentre = centreList.Where(c => c.Id == newCentre.Id);
                    if (!exitingCentre.Any())
                    {
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "no centre found with given id", Status = 1 });
                    }
                   
                    var data = exitingCentre.Select(y => y.ServiceDetails).First();
                    if (data.Any(x => x.Name == newCentre.ServiceDetails.First().Name))
                    {
                        var newSericeDetails = newCentre.ServiceDetails;

                        foreach (var service in data.Where(x => x.Name == newCentre.ServiceDetails.First().Name))
                        {


                            if (newCentre.ServiceDetails.First().Petrol.Count() > 0)
                            {
                                int count = 0;
                                foreach (var details in service.Petrol.Where( x =>newCentre.ServiceDetails.First().Petrol.Any(y=>y.Price == x.Price)))
                                {
                                    details.ModelList.AddRange(newSericeDetails.First().Petrol.First().ModelList);
                                    count++;
                                }
                                if(count == 0)
                                service.Petrol.AddRange(newCentre.ServiceDetails.First().Petrol);

                            }

                            if (newCentre.ServiceDetails.First().Diesel.Count() > 0)
                            {
                                int count = 0;
                                foreach (var details in service.Diesel.Where(x => newCentre.ServiceDetails.First().Diesel.Any(y => y.Price == x.Price)))
                                {
                                    details.ModelList.AddRange(newSericeDetails.First().Diesel.First().ModelList);
                                    count++;
                                }
                                if (count == 0)
                                service.Diesel.AddRange(newCentre.ServiceDetails.First().Diesel);
                            }

                            if (newCentre.ServiceDetails.First().CNG.Count() > 0)
                            {
                                int count = 0;
                                foreach (var details in service.CNG.Where(x => newCentre.ServiceDetails.First().CNG.Any(y => y.Price == x.Price)))
                                {
                                    details.ModelList.AddRange(newSericeDetails.First().CNG.First().ModelList);
                                    count++;
                                }
                                if (count == 0)
                                    service.CNG.AddRange(newCentre.ServiceDetails.First().CNG);
                            }

                            if (newCentre.ServiceDetails.First().Electric.Count() > 0)
                            {
                                int count = 0;
                                foreach (var details in service.Electric.Where(x => newCentre.ServiceDetails.First().Electric.Any(y => y.Price == x.Price)))
                                {
                                    details.ModelList.AddRange(newSericeDetails.First().Electric.First().ModelList);
                                    count++;
                                }
                                if (count == 0)
                                service.Electric.AddRange(newCentre.ServiceDetails.First().Electric);
                            }
                        }

                        collection.UpdateOneAsync(filter, update);
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "new service details updated", Status = 1 });
                    }
                    else
                    {
                        data.AddRange(newCentre.ServiceDetails); // if deatils of service is not exist than add to collection
                        collection.UpdateOneAsync(filter, update);
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "new service details updated", Status = 1 });
                    }
                }
            
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "Please enter Area Name", Status = 1 });
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
