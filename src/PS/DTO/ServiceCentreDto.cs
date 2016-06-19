using System;
using System.Collections.Generic;
using System.Linq;
using MongoDB.Bson;
using MongoDB.Driver;
using PS.Models;
using PS.Services;
using System.Device.Location;
using System.Net;
using Microsoft.AspNet.Mvc;

namespace PS.DTO
{
    public class ServiceCentreDto
    {
        private const string Collection = "Pune";
        private const string Database = "serviceCentre";
        private readonly MongoRepository _repo = new MongoRepository(Database);
        private double _lat;
        private double _lng;

        public List<ServiceCentreViewModel> ListServiceCentres(SelectedService selectedService)
        {
            try
            {
                var collection = _repo.GetCollection<ServiceCentreGeo>(selectedService.City);
                double.TryParse(selectedService.Latitude, out _lat);

                double.TryParse(selectedService.Longitude, out _lng);
                var userCordinates = new GeoCoordinate(_lat, _lng);
                var geoNearQuery = GetGeoNearQuery(_lat, _lng);
                var centreList = collection?.Find(geoNearQuery).ToListAsync().Result;
                if (centreList != null)
                {
                    var matchingCentre = GetMatchingServiceCentre(centreList, selectedService, userCordinates);
                    return matchingCentre.OrderByDescending(x => x.Review).ToList();
                }
            }

            catch (Exception ex)
            {
                // ignored
            }
            return null;
        }

        private static BsonDocument GetGeoNearQuery(double lat, double lng)
        {
            var geoNearQuery = new BsonDocument
            {
                {
                    "Location", new BsonDocument
                    {
                        {
                            "$nearSphere", new BsonDocument
                            {
                                {
                                    "$geometry", new BsonDocument
                                    {
                                        {"type", "Point"},
                                        {"coordinates", new BsonArray {lng, lat}},

                                    }
                                },
                                {"$maxDistance", 10000},
                            }
                        }
                    }
                }
            };
            return geoNearQuery;

        }

        private IEnumerable<ServiceCentreViewModel> GetMatchingServiceCentre(IEnumerable<ServiceCentreGeo> centreList,
            SelectedService selectedService, GeoCoordinate userCordinates)
        {
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
                    double.TryParse(centre.Latitude, out _lat);
                    double.TryParse(centre.Longitude, out _lng);
                    var centreCoordinates = new GeoCoordinate(_lat, _lng);
                    distance = userCordinates.GetDistanceTo(centreCoordinates)/1000;
                }

                // if no service selected then display all service centre list
                if (selectedService.Name.Count == 0)
                {
                    selectedCentres.Add(new ServiceCentreViewModel
                    {
                        Id = centre.CentreId,
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
                        x =>
                            centre.ServiceDetails.Any(
                                y => string.Equals(y.Name.Trim(), x.Trim(), StringComparison.CurrentCultureIgnoreCase))))
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
                                IsFreePickUp = radius <= distance,
                                MilematePrice = milematesPrice[milematesPrice.Count - 1],
                                ActualPrice = actualPrice[actualPrice.Count - 1]
                            });
                    }

                    if (selectedService.Name.Count == milematesPrice.Count)
                        selectedCentres.Add(new ServiceCentreViewModel
                        {
                            Id = centre.CentreId,
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

        public string SaveCentreDetails(ServiceCentreGeo newCentre)
        {
            // if No id then create new Centre doc

            if (newCentre != null && string.IsNullOrWhiteSpace(newCentre?.CentreId))
            {
                var id = _repo.GenerateNewId();
                newCentre.CentreId = id;
                newCentre.Location = new Location(newCentre.Latitude,newCentre.Longitude);
                _repo.insertDocument(Database, Collection, newCentre);
                return "new doc is created";
            }
           
            // if has id then update details into existing centre
                var filter = Builders<ServiceCentreGeo>.Filter.Where(x => x.CentreId.Equals(newCentre.CentreId));
                var existingCentreDetails = _repo.GetFilterList(filter, Collection);

            if (existingCentreDetails == null)
                return "no service Centre with exist give Id";

             UpdateExistingCentreDetails(existingCentreDetails.First(),newCentre);
            return "New Details has been updated";
        }

        public void UpdateExistingCentreDetails(ServiceCentreGeo existingCentre, ServiceCentreGeo newCentre)
        {
            var collection = _repo.GetCollection<ServiceCentreGeo>("Pune");
            var filter = Builders<ServiceCentreGeo>.Filter.Where(x => x.CentreId.Equals(newCentre.CentreId));

            if (existingCentre.ServiceDetails.Any(x => x.Name == newCentre.ServiceDetails.First().Name))
            {
                var newSericeDetails = newCentre.ServiceDetails;
                foreach (
                    var service in
                        existingCentre.ServiceDetails.Where(x => x.Name == newCentre.ServiceDetails.First().Name)
                    )
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
                collection?.ReplaceOneAsync(filter, existingCentre);

            }
            else
            {
                existingCentre.ServiceDetails.AddRange(newCentre.ServiceDetails);
                // if deatils of service is not exist than add to collection var 
                var update = Builders<ServiceCentreGeo>.Update.Set("ServiceDetails", existingCentre.ServiceDetails);
                collection.UpdateOneAsync(filter, update);
            }
        }

    }
}
