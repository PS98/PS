using System;
using System.Collections.Generic;
using System.Linq;
using MongoDB.Bson;
using MongoDB.Driver;
using PS.Models;
using PS.Services;
using System.Device.Location;
using System.Globalization;
using System.IO;
using System.Net;
using PS.Helper;
using MongoDB.Driver.Builders;
using Newtonsoft.Json;

namespace PS.DTO
{
    public class ServiceCentreDto
    {
        private const string Collection = "Pune";
        private const string Database = "serviceCentre";
        private const string GoogleMapDistanceMatixApi = "http://maps.googleapis.com/maps/api/distancematrix/json?";
        private readonly MongoRepository _repo;
        private const string Origin = "origins=";
        private const string Destination = "&destinations=";
       
        private double _lat;
        private double _lng;
        private GeoCoordinate userCordinates;

        public ServiceCentreDto()
        {
            _repo = new MongoRepository(Database);
        }
    public List<ServiceCentreViewModel> ListServiceCentres(SelectedService selectedService)
        {
            try
            {
                CheckOrCreateIndex();
                var collection = _repo.GetCollection<ServiceCentreGeo>(selectedService.City);
                double.TryParse(selectedService.Latitude, out _lat);
                selectedService.Name = GetMappedServiceName(selectedService.Name);
                double.TryParse(selectedService.Longitude, out _lng);
                 userCordinates = new GeoCoordinate(_lat, _lng);
                var geoNearQuery = GetGeoNearQuery(_lat, _lng);
                var centreList = collection?.Find(geoNearQuery).ToListAsync().Result;
                if (centreList != null && centreList.Any())
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

        private IEnumerable<ServiceCentreViewModel> GetMatchingServiceCentre(List<ServiceCentreGeo> centreList,
            SelectedService selectedService, GeoCoordinate userCordinates)
        {
            var selectedCentres = new List<ServiceCentreViewModel>();

            var distanceList = GetDistanceFromUser(centreList);
            foreach (var centre in centreList)
            {
                var milematesPrice = new List<int>();
                var actualPrice = new List<int>();
                var serviceDetails = new List<Detalis>();
                var priceObj = new PriceDetails();
                double distance = 0;
                if (distanceList != null && distanceList.rows.Any() && distanceList.rows.FirstOrDefault().elements.Any())
                {

                    double.TryParse(distanceList.rows.First().elements.First().distance.value.ToString(), out distance);
                    distance = distance > 0 ? distance/1000 : 0;
                    distanceList.rows.First().elements.Remove(distanceList.rows.First().elements.FirstOrDefault());
                }

                else if (!string.IsNullOrEmpty(selectedService.Latitude) &&
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
                        IsFreePickUp = distance< 5,
                        OpeningHours = centre.OpeningHours,
                        ClosingHours = centre.ClosingHours,
                        Holiday = Utility.GetDay(centre.Holiday)
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
                                IsFreePickUp = radius >= distance,
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
                            IsFreePickUp = serviceDetails.Any(x => x.IsFreePickUp),
                            OpeningHours = centre.OpeningHours,
                            ClosingHours = centre.ClosingHours,
                            Holiday = Utility.GetDay(centre.Holiday)
                        });
                }
            }
            return selectedCentres;
        }

        public string SaveCentreDetails(ServiceCentreGeo newCentre)
        {
            // create index if not exixt
            CheckOrCreateIndex();

            // if No id then create new Centre doc

            if (newCentre != null && string.IsNullOrWhiteSpace(newCentre?.CentreId))
            {
                var id = _repo.GenerateNewId();
                newCentre.CentreId = id;
                newCentre.Location = new Location(newCentre.Latitude,newCentre.Longitude);
                _repo.InsertDocument(Database, Collection, newCentre);
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
            var isDetalilsUpdate = false;
           if (newCentre.ServiceDetails != null && newCentre.ServiceDetails.Count > 0)
            {
                if (existingCentre.ServiceDetails.Any(x => x.Name == newCentre.ServiceDetails.First().Name))
                {
                    foreach (var service in existingCentre.ServiceDetails.Where(x => x.Name == newCentre.ServiceDetails.First().Name))
                    {
                        if (newCentre.ServiceDetails.First().Petrol.Any())
                        {
                            UpdatePriceAndModelList(service.Petrol, newCentre.ServiceDetails.First().Petrol);
                        }

                        if (newCentre.ServiceDetails.First().Diesel.Any())
                        {
                            UpdatePriceAndModelList(service.Diesel, newCentre.ServiceDetails.First().Diesel);
                        }

                        if (newCentre.ServiceDetails.First().CNG.Any())
                        {
                            UpdatePriceAndModelList(service.CNG, newCentre.ServiceDetails.First().CNG);
                        }

                        if (newCentre.ServiceDetails.First().Electric.Any())
                        {
                            UpdatePriceAndModelList(service.Electric, newCentre.ServiceDetails.First().Electric);
                        }
                    }
                    isDetalilsUpdate = true;
                }
                else
                {
                   existingCentre.ServiceDetails.AddRange(newCentre.ServiceDetails);
                    // if deatils of service is not exist than add to collection var 
                    UpdateCentreDataInMongo(existingCentre, true);
                        return;
                  }
               
            }
            if (newCentre.Services != null && newCentre.Services.Count > 0)
            {
                if (existingCentre.Services == null)
                    existingCentre.Services = new List<string>();
                existingCentre.Services.AddRange(newCentre.Services);
                existingCentre.Services = existingCentre.Services.Distinct().ToList();
                isDetalilsUpdate = true;
            }
            if(isDetalilsUpdate)
                UpdateCentreDataInMongo(existingCentre);

        }

        public void UpdateCentreDataInMongo(ServiceCentreGeo centreDetails,bool isUpdateOnlyServiceDetails = false)
        {
            var collection = _repo.GetCollection<ServiceCentreGeo>("Pune");
            var filter = Builders<ServiceCentreGeo>.Filter.Where(x => x.CentreId.Equals(centreDetails.CentreId));
            if (!isUpdateOnlyServiceDetails)
            {
                collection?.ReplaceOneAsync(filter, centreDetails);
                return;
            }
            var update = Builders<ServiceCentreGeo>.Update.Set("ServiceDetails",
                           centreDetails.ServiceDetails);
            collection.UpdateOneAsync(filter, update);

        }
        public void UpdatePriceAndModelList(List<PriceDetails> priceDetails, List<PriceDetails> newPriceList)
        {
            var count = 0;
            foreach (var priceDetail in priceDetails.Where( x=> newPriceList.Any( y=>y.MilematePrice == x.MilematePrice)))
            {
                priceDetail.ModelList.AddRange(newPriceList.First().ModelList);
                priceDetail.ModelList = priceDetail.ModelList.Distinct().ToList();
                count++;
            }
            if (count == 0)
                priceDetails.AddRange(newPriceList);
        }

        public async void  CheckOrCreateIndex()
        {
            try
            {
                var collection = _repo.GetCollection<ServiceCentreGeo>("Pune");
           //     var keys = Builders<BsonDocument>.IndexKeys.Ascending("cuisine");
               IndexKeysBuilder Key = IndexKeys.GeoSpatialSpherical("location");
                IndexKeysDefinitionBuilder<ServiceCentreGeo> key = new IndexKeysDefinitionBuilder<ServiceCentreGeo>();
                var option = IndexOptions.SetName("Location_2dsphere");

                key.Geo2DSphere(x => x.Location);
                IndexKeysDefinition<ServiceCentreGeo> jk = new JsonIndexKeysDefinition<ServiceCentreGeo>("{Location : \"2dsphere\" }");
                jk.Geo2DSphere(x=>x.Location);
                CreateIndexOptions options = new CreateIndexOptions();
                options.Name = "Location_2dsphere";
                bool isIndexExist = false;
              
                using (var cursor = await collection.Indexes.ListAsync())
                {
                    var indexes = await cursor.ToListAsync();
                    isIndexExist = indexes.Any(x => x["name"] == "Location_2dsphere");
                }

                if (!isIndexExist)
                {
                    await collection.Indexes.CreateOneAsync(jk, options); 
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            
        }

        private List<string> GetMappedServiceName( List<string> list )
        {
            return list.Select(GetEquivalentServiceName).ToList();
        }

        private static string GetEquivalentServiceName(string service)
        {
            if (string.IsNullOrEmpty(service))
            {
                return string.Empty;
            }
            switch (service)
            {

                case "Every 3 months or 3,000 miles":
                case "Lite Car Care":
                    service = "Lite Car Care";
                    break;
                case "Every 6 months or 6,000 miles":
                case "Essential Car Care":
                    service = "Essential Car Care";
                    break;
                case "Every 12 months or 12,000 miles":
                case "Comprehensive Car Care":
                    service = "Comprehensive Car Care";
                    break;
            }
            return service;
        }

        public ServiceCentreGeo GetCentreDetailsById(string centreId)
        {
          var collection =   _repo.GetCollection<ServiceCentreGeo>("Pune");
            var list = collection.Find(x => x.CentreId.Equals(centreId)).ToListAsync().Result;
            if (list != null && list.Any())
            {
                return list.FirstOrDefault();
            }
            return null;

        }

        public GoogleDistanceMatix GetDistanceFromUser(List<ServiceCentreGeo> centreList)
        {
            var origin = $"{userCordinates.Latitude.ToString(CultureInfo.InvariantCulture)},{userCordinates.Longitude.ToString(CultureInfo.InvariantCulture)}";
            var destinationList = ListToCommaSepratedString(centreList.Select(x => x.Location).ToList());
            return GetDrivingDistance(origin, destinationList);
        }

        public string ListToCommaSepratedString(List<Location> locationsList)
        {
            var latLngString = "";
            foreach (var location in locationsList)
            {
                foreach (var coordinate in location.Coordinates.OrderBy(x=>x).Select((value, index) => new { value, index }))
                {
                 latLngString += coordinate.value.ToString(CultureInfo.InvariantCulture);
                    if (coordinate.index == 0)
                        latLngString += ",";

                }
                latLngString += "|";
            }
            return latLngString;
        }


        public GoogleDistanceMatix GetDrivingDistance(string originCoordiates, string destinationCoordinates)
        {
            var url = $"{GoogleMapDistanceMatixApi}{Origin}{originCoordiates}{Destination}{destinationCoordinates}";
            GoogleDistanceMatix calucatedDistance = new GoogleDistanceMatix();
            var request =(HttpWebRequest)WebRequest.Create(url);
            try
            {
                var response = (HttpWebResponse)request.GetResponse();
              using (var streamReader = new StreamReader(response.GetResponseStream()))
                {
                    var result = streamReader.ReadToEnd();

                    if (!string.IsNullOrEmpty(result))
                    {
                        calucatedDistance = JsonConvert.DeserializeObject<GoogleDistanceMatix>(result);
                    }
                }
                return calucatedDistance;
            }
            catch (Exception)
            {

                return null;
                //;
            }

        }

        public  List<ServiceDetails> GetCentrePriceDetails(string centreId)
        {
            var serviceCentre = GetCentreDetailsById(centreId);
            return serviceCentre?.ServiceDetails;
        }
        #region Admin 

        public List<CarVerientPrice> GetCarPriceList(string centreId)
        {
            var serviceCentre = GetCentreDetailsById(centreId);
            var varientList = new List<CarVerientPrice>();
            var carBrandAndModel = new Dictionary<string, List<string>>();
            var price = new CentrePriceDetails();
            var repo = new MongoRepository("car");
            var carList = repo.GetAllCollectionName();
            foreach (var docName in carList)
            {
                var modelList = repo.GetDocumentList<Car>(docName);
                // varientList.AddRange(modelList.Select(x => x.name).ToList());
                carBrandAndModel.Add(docName, modelList.Select(x => x.name).ToList());
            }

            foreach (var dicObj in carBrandAndModel)
            {
                price.BrandName = dicObj.Key;

                //foreach (var priceDetails in dicObj.Value.Select(model => serviceCentre.ServiceDetails.Where(x => x.Name.Equals("Lite") && x.Petrol.Any(y => y.ModelList.Contains(model)))).Select(priceList => priceList.FirstOrDefault()).Where(firstOrDefault => firstOrDefault != null).Select(firstOrDefault => firstOrDefault.Petrol.FirstOrDefault()).Where(priceDetails => priceDetails != null))
                //{
                //    vp.LiteServicePrice =  priceDetails.ServiceCentrePrice; 
                //}

                //foreach (var serviceDetail in serviceCentre.ServiceDetails.Where(x=>x.Petrol.Any(priceDetails=> priceDetails.ModelList.All(model=> dicObj.Value.Any(selected=>string.Equals(selected,model, StringComparison.CurrentCultureIgnoreCase))))))
                //{

                //}

                foreach (var modelName in dicObj.Value)
                {
                    var modelVarient = dicObj.Key + "-" + modelName;
                    var petrolObject = GetCarVerientPrice(serviceCentre.ServiceDetails, modelName, "Petrol");
                    petrolObject.VarientName = modelVarient;
                    petrolObject.CentreId = centreId;
                    var dieselObject = GetCarVerientPrice(serviceCentre.ServiceDetails, modelName, "Diesel");
                    dieselObject.VarientName = modelVarient;
                    dieselObject.CentreId = centreId;
                    varientList.Add(petrolObject);
                    varientList.Add(dieselObject);
                }
            }
            return varientList;
        }

        public CarVerientPrice GetCarVerientPrice(List<ServiceDetails> details, string modelName, string type)
        {
            var isPetrolPrice = type.Equals("Petrol");
            var priceobject = new CarVerientPrice
            {
                VarientName = modelName,
                LiteServicePrice = GetServiceCentrePrice(details, Utility.LiteCarCare, modelName, isPetrolPrice),
                EssentialServicePrice =
                            GetServiceCentrePrice(details, Utility.EssentialCarCare, modelName, isPetrolPrice),
                ComprehensiveServicePrice =
                            GetServiceCentrePrice(details, Utility.ComprehensiveCarCare, modelName, isPetrolPrice),
                EngineType = type
            };
            return priceobject;
        }
        public string GetServiceCentrePrice(List<ServiceDetails> details, string serviceName, string modelName, bool type)
        {
            var priceData = GetPriceDetailsForModel(details, serviceName, modelName, type);
            return priceData?.ServiceCentrePrice.ToString();
        }

        public PriceDetails GetPriceDetailsForModel(List<ServiceDetails> details, string serviceName, string modelName,bool type)
        {
            if (type)
            {
                var petrolPriceList = from serviceDetail in details
                                      where serviceDetail.Name == serviceName
                                      from source in serviceDetail.Petrol.Where(x => x.ModelList.Contains(modelName))
                                      select source;
                return petrolPriceList.FirstOrDefault();
            }
            var diselPriceList = from serviceDetail in details
                                 where serviceDetail.Name == serviceName
                                 from source in serviceDetail.Diesel.Where(x => x.ModelList.Contains(modelName))
                                 select source;
            return diselPriceList.FirstOrDefault();
        }
        public void UpdateServiceCentrePriceData(CarVerientPrice updatedPrice)
        {
                var serviceCentre = GetCentreDetailsById(updatedPrice.CentreId);
                UpdatePriceDetails(updatedPrice,serviceCentre);
                UpdateCentreDataInMongo(serviceCentre);
        }

        public void UpdatePriceDetails(CarVerientPrice updatedPrice,ServiceCentreGeo serviceCentre)
        {
            var nameList = updatedPrice.VarientName.Split('-');
            string model = null;
            for (var i = 1; i < nameList.Length; i++)
            {
                model = model== null ? nameList[i] : model +"-" + nameList[i];
            }
            var isEngineTypePetrol = updatedPrice.EngineType.ToLower().Equals("petrol");
            int liteServicePrice, essentialServicePrice, comprehensiveServicePrice;

            int.TryParse(updatedPrice.LiteServicePrice, out liteServicePrice);
            int.TryParse(updatedPrice.EssentialServicePrice, out essentialServicePrice);
            int.TryParse(updatedPrice.ComprehensiveServicePrice, out comprehensiveServicePrice);

            var dic = new Dictionary<string, int>
            {
                {Utility.LiteCarCare, liteServicePrice},
                {Utility.EssentialCarCare, essentialServicePrice},
                {Utility.ComprehensiveCarCare, comprehensiveServicePrice}
            };
            var dic1 = new Dictionary<string, string>
            {
                {Utility.LiteCarCare, updatedPrice.LiteServicePrice},
                {Utility.EssentialCarCare, updatedPrice.EssentialServicePrice},
                {Utility.ComprehensiveCarCare, updatedPrice.ComprehensiveServicePrice}
            };
            foreach (var val in dic)
            {
                string price;
                dic1.TryGetValue(val.Key, out price);

                if (!string.IsNullOrEmpty(price))
                    UpdateServicePrice(serviceCentre.ServiceDetails, val.Key, model, val.Value, isEngineTypePetrol);
                else
                {
                    RemoveModelFromModelList(serviceCentre.ServiceDetails,val.Key,model,isEngineTypePetrol);
                }
            }
        }
        public void UpdateServicePrice(List<ServiceDetails> details, string serviceName, string modelName, int price,bool type)
        {
            var exitingPriceData = GetExistingPriceDetailsFromPrice(details, serviceName, price, type);
            if (exitingPriceData != null)
            {
                RemoveModelFromModelList(details, serviceName, modelName, type); // remove model name 
                exitingPriceData.ModelList.Add(modelName);
                exitingPriceData.ModelList= exitingPriceData.ModelList.Distinct().ToList();
            }
            else
            {
                UpdatePriceForService(details.FirstOrDefault(x => x.Name.Equals(serviceName)), serviceName,
                    modelName, price, type);
            }
        }

        public PriceDetails GetExistingPriceDetailsFromPrice(List<ServiceDetails> details, string serviceName, int price, bool type)
        {
            price = price + Utility.GetMileMatesMargin(serviceName);
            if (type)
            {
              var  petrolPriceObject = from serviceDetail in details
                                      where serviceDetail.Name == serviceName
                                      from source in serviceDetail.Petrol.Where(x => x.MilematePrice.Equals(price))
                                      select source;
            return petrolPriceObject.FirstOrDefault();
            }
           var dieselPriceObject = from serviceDetail in details
                                 where serviceDetail.Name == serviceName
                                 from source in serviceDetail.Diesel.Where(x => x.MilematePrice.Equals(price))
                                 select source;
           return dieselPriceObject.FirstOrDefault();
        }

        public ServiceDetails UpdatePriceForService(ServiceDetails details, string serviceName, string modelName, int price, bool type)
        {
            var modelList = new List<string> {modelName};
            if (details == null)
            {
                details = new ServiceDetails
                {
                    Name = serviceName,
                    Petrol = new List<PriceDetails>(),
                    Diesel = new List<PriceDetails>()
                };
            }
            AddNewPriceDetails(details,serviceName,modelList,price,type);
            return details;
        }

        public void RemoveModelFromModelList(List<ServiceDetails> details, string serviceName, string modelName, bool type)
        {
            var priceDetails = GetPriceDetailsForModel(details, serviceName, modelName, type);
            priceDetails?.ModelList.Remove(modelName);
        }

        public void SaveUpdatedRow(List<CarVerientPrice> updatedList)
        {

            var serviceCentre = GetCentreDetailsById(updatedList.First().CentreId);
            UpdateCentreDetails(serviceCentre,updatedList);
            UpdateCentreDataInMongo(serviceCentre);
        }

        public void AddNewPriceDetails(ServiceDetails existingServiceDetails,  string serviceName, List<string> modelList, int price, bool type)
        {
            var pricedetails = new PriceDetails
            {
                MilematePrice = price + Utility.GetMileMatesMargin(serviceName),
                ServiceCentrePrice = price,
                ActualPrice = Utility.GenerateRandomNo(price, serviceName),
                ModelList = modelList
            };
            if (existingServiceDetails == null)
            {
                existingServiceDetails = new ServiceDetails
                {
                    Name = serviceName,
                    Petrol = new List<PriceDetails>(),
                    Diesel = new List<PriceDetails>()
                };
            }
            if (type)
            {
                existingServiceDetails.Petrol.Add(pricedetails);
                return;
            }
            existingServiceDetails.Diesel.Add(pricedetails);
        }

        public void UpdateCentreDetails(ServiceCentreGeo serviceCentre, List<CarVerientPrice> updatePriceList)
        {
           var serviceNameList = new List<string>
            {
                Utility.LiteCarCare,
                Utility.EssentialCarCare,
                Utility.ComprehensiveCarCare
            };

            foreach (var service in serviceNameList)
            {
                var petrolPriceDic = new Dictionary<int, List<string>>();
                var dieselPriceDic = new Dictionary<int, List<string>>();
                IEnumerable<string> uniqePriceList;
                IEnumerable<string> petrolModelWithoutPrice;
                IEnumerable<string> dieselModelWithoutPrice;
                switch (service)
                {
                    case Utility.LiteCarCare:
                        uniqePriceList = updatePriceList.Select(x => x.LiteServicePrice).Distinct();
                        petrolModelWithoutPrice = updatePriceList.Where(x => string.IsNullOrEmpty(x.LiteServicePrice) && x.EngineType.Equals("Petrol")).Select(y => y.VarientName);
                        dieselModelWithoutPrice = updatePriceList.Where(x => string.IsNullOrEmpty(x.LiteServicePrice) && x.EngineType.Equals("Diesel")).Select(y => y.VarientName);
                        break;
                    case Utility.ComprehensiveCarCare:
                        uniqePriceList = updatePriceList.Select(x => x.ComprehensiveServicePrice).Distinct();
                        petrolModelWithoutPrice = updatePriceList.Where(x => string.IsNullOrEmpty(x.ComprehensiveServicePrice) && x.EngineType.Equals("Petrol")).Select(y => y.VarientName);
                        dieselModelWithoutPrice = updatePriceList.Where(x => string.IsNullOrEmpty(x.ComprehensiveServicePrice) && x.EngineType.Equals("Diesel")).Select(y => y.VarientName);
                        break;
                    default:
                        uniqePriceList = updatePriceList.Select(x => x.EssentialServicePrice).Distinct();
                        petrolModelWithoutPrice = updatePriceList.Where(x => string.IsNullOrEmpty(x.EssentialServicePrice) && x.EngineType.Equals("Petrol")).Select(y => y.VarientName);
                        dieselModelWithoutPrice = updatePriceList.Where(x => string.IsNullOrEmpty(x.EssentialServicePrice) && x.EngineType.Equals("Diesel")).Select(y => y.VarientName);
                        break;
                }
                GetPriceModelDictionary(uniqePriceList, service, updatePriceList, petrolPriceDic, dieselPriceDic);
                RemoveModelWithoutPrice(serviceCentre.ServiceDetails.Where(x => x.Name.Equals(service)).ToList(), service, petrolModelWithoutPrice, true);
                RemoveModelWithoutPrice(serviceCentre.ServiceDetails.Where(x => x.Name.Equals(service)).ToList(), service, dieselModelWithoutPrice, false);
                UpdateOrAddPriceDetails(serviceCentre.ServiceDetails, petrolPriceDic, service, true);
                UpdateOrAddPriceDetails(serviceCentre.ServiceDetails, dieselPriceDic, service, false);


            }
        }

        public void GetPriceModelDictionary(IEnumerable<string> priceList, string serviceName, List<CarVerientPrice> updatePriceList, Dictionary<int, List<string>> petrolPriceDic, Dictionary<int, List<string>> dieselPriceDic)
        {
            foreach (var price in priceList.Where(price => !string.IsNullOrEmpty(price)))
            {
                int value;
                int.TryParse(price, out value);
                switch (serviceName)
                {
                    case Utility.LiteCarCare:
                        if(updatePriceList.Any(x => x.LiteServicePrice == price && x.EngineType.Equals("Petrol")))

                        petrolPriceDic.Add(value,
                            updatePriceList.Where(x => x.LiteServicePrice == price && x.EngineType.Equals("Petrol"))
                                .Select(y => GetVarientName(y.VarientName))
                                .ToList());

                        if (updatePriceList.Any(x => x.LiteServicePrice == price && x.EngineType.Equals("Diesel")))

                            dieselPriceDic.Add(value,
                            updatePriceList.Where(x => x.LiteServicePrice == price && x.EngineType.Equals("Diesel"))
                                .Select(y => GetVarientName(y.VarientName))
                                .ToList());
                        break;
                    case Utility.EssentialCarCare:
                        if (updatePriceList.Any(x => x.EssentialServicePrice == price && x.EngineType.Equals("Petrol")))

                            petrolPriceDic.Add(value,
                            updatePriceList.Where(x => x.EssentialServicePrice == price && x.EngineType.Equals("Petrol"))
                                .Select(y => GetVarientName(y.VarientName))
                                .ToList());

                        if (updatePriceList.Any(x => x.EssentialServicePrice == price && x.EngineType.Equals("Diesel")))

                            dieselPriceDic.Add(value,
                            updatePriceList.Where(x => x.EssentialServicePrice == price && x.EngineType.Equals("Diesel"))
                                .Select(y => GetVarientName(y.VarientName))
                                .ToList());
                        break;
                    case Utility.ComprehensiveCarCare:
                        if (updatePriceList.Any(x => x.ComprehensiveServicePrice == price && x.EngineType.Equals("Petrol")))

                            petrolPriceDic.Add(value,
                            updatePriceList.Where(x => x.ComprehensiveServicePrice == price && x.EngineType.Equals("Petrol"))
                                .Select(y => GetVarientName(y.VarientName))
                                .ToList());

                        if (updatePriceList.Any(x => x.ComprehensiveServicePrice == price && x.EngineType.Equals("Diesel")))
                            dieselPriceDic.Add(value,
                            updatePriceList.Where(x => x.ComprehensiveServicePrice == price && x.EngineType.Equals("Diesel"))
                                .Select(y => GetVarientName(y.VarientName))
                                .ToList());
                        break;
                }
            }
        }

        public string GetVarientName(string name)
        {
            return name.Contains('-') ? name.Split('-')[1] : name;
        }
        public List<ServiceDetails> UpdateOrAddPriceDetails(List<ServiceDetails> existingServiceDetails, Dictionary<int, List<string>> priceModelDictionary,string serviceName, bool type)
        {
            foreach (var data in priceModelDictionary)
            {
                var serviceDetails = GetExistingPriceDetailsFromPrice(existingServiceDetails,serviceName, data.Key, type);
                if (serviceDetails != null)
                {
                    serviceDetails.ModelList.AddRange(data.Value);
                }
                else
                {
                    AddNewPriceDetails(existingServiceDetails.FirstOrDefault(x => x.Name.Equals(serviceName)), serviceName, data.Value, data.Key, type);
                }
            }

            return existingServiceDetails;
        }

        public void RemoveModelWithoutPrice(List<ServiceDetails> details, string serviceName, IEnumerable<string> modelList, bool type)
        {
            foreach (var model in modelList)
            {
                RemoveModelFromModelList(details, serviceName, GetVarientName(model), type);
            }
        }
        #endregion
    }
}
