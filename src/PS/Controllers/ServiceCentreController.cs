﻿using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using PS.Models;
using PS.Services;
using System.Net;
using System.Device.Location;
using PS.DTO;
using PS.Filters;
using Microsoft.AspNet.Http;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PS.Controllers
{
    [Route("api/[controller]")]
    public class ServiceCentreController : BaseController
    {

        private readonly MongoRepository _repo = new MongoRepository("serviceCentre");
        private const string Database = "serviceCentre";
        public readonly string CollectionName = "Pune";

        private readonly ServiceCentreDto _serviceCentreDto = new ServiceCentreDto();


        // GET: api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {

            var collection = _repo.GetAllCollectionName();

            return collection;
        }

        [Route("centerlist")]
        [HttpGet]
        [AdminAuthorize]
        public List<ServiceCentreGeo> GetCenterList()
        {
            var collection = _repo.GetCollection<ServiceCentreGeo>("Pune");
            if (userDetails.CentreId == "0")
                return collection?.Find(new BsonDocument()).ToListAsync().Result;
            else
                return collection.Find(e => e.CentreId == userDetails.CentreId).ToListAsync().Result;
        }

        // GET api/values/5
        [HttpGet("{city}")]
        public IEnumerable<string> Get(string city)
        {

            try
            {
                var collection = _repo.GetCollection<ServiceCentre>(city);
                var areaList = collection?.Find(new BsonDocument()).ToListAsync().Result;
                return areaList?.Select(x => x.Area).Distinct();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [HttpPost]
        [Route("centerlist/geo")]
        public IEnumerable<ServiceCentreViewModel> Get([FromBody] SelectedService selectedService)
        {
            var collection = _repo.GetCollection<ServiceCentre>(selectedService.City);
            //var builder = Builders<BsonDocument>.Filter;
            //var filter = builder.Eq("location", "Italian");
            //var tcord = new GeoJson2DCoordinates(14, 14);
            //var jk = new GeoJsonPoint<GeoJson2DCoordinates>(tcord);
            //Query.Near("geometry", jk, 5);
            //var documentList1 = collection.FindAsync<ServiceCentre>(Builders<ServiceCentre>.Filter.NearSphere(p => p.Centres, 18.6005340690473, 73.6005340690473, 10));
            // var filter = Builders<BsonDocument>.Filter.Eq("area", selectedService.Area);
            var documentList = collection?.Find(new BsonDocument()).ToListAsync().Result;
            //var result = await collection.Find(filter).ToListAsync();
            // get document by area
            var list = documentList?.Where(x => x.Area.ToLower() == selectedService.Area.ToLower());
            if (list == null) return null;
            {
                var serviceCentres = list as IList<ServiceCentre> ?? list.ToList();
                if (!serviceCentres.Any()) return null;

                // select first because one area will have one document
                var centreList = serviceCentres.First().Centres;
                //  if (!string.IsNullOrEmpty(selectedService.Latitude) && !string.IsNullOrEmpty(selectedService.Longitude))

                foreach (var area in serviceCentres.First().NearAreas)
                {
                    var nearAreaDoc = documentList.Where(x => Equals(x.Area.ToLower(), area.ToLower()));
                    var areaDoc = nearAreaDoc as IList<ServiceCentre> ?? nearAreaDoc.ToList();
                    var any = areaDoc.Any();
                    if (!any) continue;
                    centreList.AddRange(areaDoc.First().Centres);
                }


                // select only those which are providing all selected services;
                double lat;
                double.TryParse(selectedService.Latitude, out lat);

                double log;
                double.TryParse(selectedService.Longitude, out log);

                var userCordinates = new GeoCoordinate(lat, log);

                var selectedCentres = new List<ServiceCentreViewModel>();
                foreach (var centre in centreList)
                {
                    var milematesPrice = new List<int>();
                    var actualPrice = new List<int>();
                    var serviceDetails = new List<Detalis>();
                    var priceObj = new PriceDetails();
                    double distance = 0;

                    if (!string.IsNullOrEmpty(selectedService.Latitude) &&
                        !string.IsNullOrEmpty(selectedService.Longitude))
                    {
                        double.TryParse(centre.Latitude, out lat);
                        double.TryParse(centre.Longitude, out log);
                        var centreCoordinates = new GeoCoordinate(lat, log);


                        distance = userCordinates.GetDistanceTo(centreCoordinates) / 1000;
                    }

                    // if no service selected then display all service centre list
                    if (selectedService.Name.Count == 0)
                    {
                        selectedCentres.Add(new ServiceCentreViewModel
                        {
                            Id = centre.Id,
                            Name = centre.Name,
                            Address = centre.Address,
                            Latitude = centre.Latitude,
                            Longitude = centre.Longitude,
                            PhoneNo = centre.PhoneNo,
                            TotalMMPrice = 0,
                            TotalActualPrice = 0,
                            ServiceDetails = serviceDetails,
                            Distance = distance,
                            Review = centre.Review,
                            Services = centre.Services,
                            IsFreePickUp = false
                        });
                        continue;
                    }

                    //  check if centre is providing all user selected service
                    if (
                        !selectedService.Name.All(
                            x => centre.ServiceDetails.Any(y => y.Name.Trim().ToLower() == x.Trim().ToLower())))
                        continue;
                    {
                        foreach (
                            var abc in
                                centre.ServiceDetails.Where(abc => selectedService.Name.Contains(abc.Name.Trim()))
                                    .Where(abc => !string.IsNullOrEmpty(selectedService.Type)))
                        {
                            switch (selectedService.Type.ToLower().Trim())
                            {
                                case "petrol":
                                    priceObj =
                                        abc.Petrol?.FirstOrDefault(x => x.ModelList.Contains(selectedService.Model));
                                    break;
                                case "diesel":
                                    priceObj =
                                        abc.Diesel?.FirstOrDefault(x => x.ModelList.Contains(selectedService.Model));
                                    break;
                                case "cng":
                                    priceObj = abc.CNG?.FirstOrDefault(x => x.ModelList.Contains(selectedService.Model));
                                    break;
                                case "electric":
                                    priceObj =
                                        abc.Electric?.FirstOrDefault(x => x.ModelList.Contains(selectedService.Model));
                                    break;
                            }
                            if (priceObj == null) continue;
                            double radius;
                            double.TryParse(abc.Radius, out radius);
                            milematesPrice.Add(priceObj.MilematePrice);
                            actualPrice.Add(priceObj.ActualPrice);
                            if (milematesPrice.Count > 0)
                                serviceDetails.Add(new Detalis
                                {
                                    Name = abc.Name,
                                    IsFreePickUp = radius >= distance,
                                    MilematePrice = milematesPrice[milematesPrice.Count - 1],
                                    ActualPrice = actualPrice[actualPrice.Count - 1]
                                });
                        }

                        if (selectedService.Name.Count == milematesPrice.Count)
                            selectedCentres.Add(new ServiceCentreViewModel
                            {
                                Id = centre.Id,
                                Name = centre.Name,
                                Address = centre.Address,
                                Latitude = centre.Latitude,
                                Longitude = centre.Longitude,
                                PhoneNo = centre.PhoneNo,
                                TotalMMPrice = milematesPrice.Sum(),
                                TotalActualPrice = actualPrice.Sum(),
                                ServiceDetails = serviceDetails,
                                Distance = distance,
                                Review = centre.Review,
                                Services = centre.Services,
                                IsFreePickUp = serviceDetails.Any(x => x.IsFreePickUp)
                            });
                    }
                }

                return selectedCentres;
            }
        }

        // POST api/values
        [HttpPost]
        [Route("save")]
        public JsonResult Post([FromBody] ServiceCentre serviceCentreObj)
        {
            try
            {
                if (!string.IsNullOrEmpty(serviceCentreObj.Area))
                {
                    var collection = _repo.GetCollection<ServiceCentre>("Pune");

                    var documentList = collection?.Find(new BsonDocument()).ToListAsync().Result;

                    // get document by area
                    var list = documentList?.Where(x => x.Area.ToLower() == serviceCentreObj.Area.ToLower());
                    // ReSharper disable once PossibleMultipleEnumeration
                    if (!list.Any())
                    {
                        // collection.Indexes.CreateOneAsync(Builders<ServiceCentre>.IndexKeys.Geo2D(p => p.Centres.First().Location));
                        var id = _repo.GenerateNewId();
                        serviceCentreObj.Centres.First().Id = id;
                        _repo.InsertDocument(Database, CollectionName, serviceCentreObj);
                        // if new area then insert into db
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "new doc created in DataBase", Status = 0, Id = id });
                    }

                    // select first because one area will have one document
                    var centreList = list.First().Centres;
                    var filter = Builders<ServiceCentre>.Filter.Eq("Area", serviceCentreObj.Area);
                    var update = Builders<ServiceCentre>.Update.Set("Centres", centreList);

                    var newCentre = serviceCentreObj.Centres.First();

                    if (string.IsNullOrEmpty(newCentre.Id)) // no id then new centre 
                    {
                        var id = _repo.GenerateNewId();

                        serviceCentreObj.Centres.First().Id = id;
                        centreList.Add(serviceCentreObj.Centres.First());
                        collection?.UpdateOneAsync(filter, update);
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "new centre added into centreList", Status = 0, Id = id });
                    }

                    if (newCentre.ServiceDetails.Count > 0 &&
                        string.IsNullOrEmpty(newCentre.ServiceDetails.First().Name))
                    {
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "please select a service ", Status = 1 });
                    }

                    var exitingCentre = centreList.Where(c => c.Id == newCentre.Id).ToList();
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


                            if (newCentre.ServiceDetails.First().Petrol.Any())
                            {
                                int count = 0;
                                foreach (
                                    var details in
                                        service.Petrol.Where(
                                            x =>
                                                newCentre.ServiceDetails.First()
                                                    .Petrol.Any(y => y.MilematePrice == x.MilematePrice)))
                                {
                                    details.ModelList.AddRange(newSericeDetails.First().Petrol.First().ModelList);
                                    count++;
                                }
                                if (count == 0)
                                    service.Petrol.AddRange(newCentre.ServiceDetails.First().Petrol);

                            }

                            if (newCentre.ServiceDetails.First().Diesel.Any())
                            {
                                int count = 0;
                                foreach (
                                    var details in
                                        service.Diesel.Where(
                                            x =>
                                                newCentre.ServiceDetails.First()
                                                    .Diesel.Any(y => y.MilematePrice == x.MilematePrice)))
                                {
                                    details.ModelList.AddRange(newSericeDetails.First().Diesel.First().ModelList);
                                    count++;
                                }
                                if (count == 0)
                                    service.Diesel.AddRange(newCentre.ServiceDetails.First().Diesel);
                            }

                            if (newCentre.ServiceDetails.First().CNG.Any())
                            {
                                int count = 0;
                                foreach (
                                    var details in
                                        service.CNG.Where(
                                            x =>
                                                newCentre.ServiceDetails.First()
                                                    .CNG.Any(y => y.MilematePrice == x.MilematePrice)))
                                {
                                    details.ModelList.AddRange(newSericeDetails.First().CNG.First().ModelList);
                                    count++;
                                }
                                if (count == 0)
                                    service.CNG.AddRange(newCentre.ServiceDetails.First().CNG);
                            }

                            if (newCentre.ServiceDetails.First().Electric.Any())
                            {
                                int count = 0;
                                foreach (
                                    var details in
                                        service.Electric.Where(
                                            x =>
                                                newCentre.ServiceDetails.First()
                                                    .Electric.Any(y => y.MilematePrice == x.MilematePrice)))
                                {
                                    details.ModelList.AddRange(newSericeDetails.First().Electric.First().ModelList);
                                    count++;
                                }
                                if (count == 0)
                                    service.Electric.AddRange(newCentre.ServiceDetails.First().Electric);
                            }
                        }

                        collection?.UpdateOneAsync(filter, update);
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "new service details updated", Status = 1 });
                    }
                    else
                    {
                        data.AddRange(newCentre.ServiceDetails);
                        // if deatils of service is not exist than add to collection
                        collection?.UpdateOneAsync(filter, update);
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Message = "new service details updated", Status = 1 });
                    }
                }

            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "Please enter Area Name", Status = 1 });
        }

        [AdminAuthorize]
        [HttpPost]
        [Route("savecentre")]
        public JsonResult SaveCentreDetails([FromBody] ServiceCentreGeo serviceCentreObj)
        {
            try
            {
                if (serviceCentreObj == null)
                {
                    Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return Json(new { Message = "Please Select Centre", Status = 1 });
                }
                if (serviceCentreObj.ServiceDetails.Count > 0 &&
                        string.IsNullOrEmpty(serviceCentreObj.ServiceDetails.First().Name))
                {
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Message = "please select a service ", Status = 1 });
                }


                var message = _serviceCentreDto.SaveCentreDetails(serviceCentreObj);
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(new { Message = message, Status = 0 });
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return Json(new { ex.Message, Status = 2 });
            }

        }
        [HttpPost]
        [Route("centerlist")]
        public JsonResult GetCentreList([FromBody] SelectedService selectedService)
        {
            try
            {
                if (selectedService == null)
                {
                    Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return Json(new { Message = "Please Choose a Service", Status = 1 });
                }

                var centreList = _serviceCentreDto.ListServiceCentres(selectedService);
                if (centreList == null)
                {
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Message = "success", Status = 1, List = new List<string>() });
                }
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(new { Message = "success", Status = 0, List = centreList });
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return Json(new { ex.Message, Status = 2 });

            }
        }

        [HttpGet]
        [AdminAuthorize]
        [Route("priceList")]
        public JsonResult GetPriceDetails(string id)
        {
            try
            {
                if (Convert.ToInt64(userDetails.CentreId) > 0)
                    id = userDetails.CentreId;
                if (string.IsNullOrEmpty(id))
                {
                    Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return Json(new { Message = "Please Choose a Service", Status = 1 });
                }
                var list = _serviceCentreDto.GetCarPriceList(id);
                var serviceCentre = _serviceCentreDto.GetCentreDetailsById(id);
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(new { Message = "success", Status = 0, List = list, ServiceCentre = serviceCentre });
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return Json(new { ex.Message, Status = 2 });

            }
        }

        [AdminAuthorize]
        [HttpPost]
        [Route("price/update")]
        public JsonResult UpdateSelectedRow([FromBody] CarVerientPrice updatedPrice)
        {
            try
            {
                if (updatedPrice == null || string.IsNullOrEmpty(updatedPrice.VarientName) || userDetails.CentreId != "0")
                {
                    Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return Json(new { Message = "model is not valid", Status = 2 });
                }

                _serviceCentreDto.UpdateServiceCentrePriceData(updatedPrice);


                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(new { Message = "success", Status = 0 });
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return Json(new { ex.Message, Status = 2 });

            }
        }
        [AdminAuthorize]
        [HttpPost]
        [Route("price/savelist")]
        public JsonResult SaveUpdatedRow([FromBody] List<CarVerientPrice> updatedList)
        {
            try
            {
                if (updatedList == null || updatedList.Count == 0 || userDetails.CentreId != "0")
                {
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Message = "No row found to update", Status = 1 });
                }

                _serviceCentreDto.SaveUpdatedRow(updatedList);


                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(new { Message = "success", Status = 0 });
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return Json(new { ex.Message, Status = 2 });

            }
        }

        [AdminAuthorize]
        [HttpPost]
        [Route("update")]
        public JsonResult UpdateCentreData([FromBody] ServiceCentreGeo updateServiceCentreData)
        {
            try
            {
                if (updateServiceCentreData == null)
                {
                    Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    return Json(new { message = "No Data found", Status = 2 });
                }
                else
                {
                    _serviceCentreDto.updateCentreData(updateServiceCentreData);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(new { Message = "success", Status = 0 });
                }
                
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return Json(new { ex.Message, Status = 2 });

            }
        }
    }
}
