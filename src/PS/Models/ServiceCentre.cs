using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace PS.Models
{
    [BsonIgnoreExtraElements]
    public class ServiceCentre
    {
        public BsonObjectId _id { get; set; }
        public string Area { get; set; }
        public List<Centre> Centres { get; set; }
        public List<string> NearAreas { get; set; }
    }
    [BsonIgnoreExtraElements]
    public class Centre: ServiceCentreBaseModel
    {
        public List<ServiceDetails> ServiceDetails { get; set; }
        public static ServiceCentreViewModel ToViewModel(Centre centre)
        {
            var viewModel = new ServiceCentreViewModel()
            {
                Address = centre.Address,
                Id = centre.Id,
                Name = centre.Name,
                Latitude = centre.Latitude,
                Longitude = centre.Longitude,
                PhoneNo = centre.PhoneNo,
                Review = centre.PhoneNo,
                Services = centre.Services,
               // ServiceDetails = new ServiceDetails();

            };

            return viewModel;

        }

    }
 
    [BsonIgnoreExtraElements]
    public class Address
    {
        [BsonElement("line1")]
        public string Line1 { get; set; }
        [BsonElement("line2")]
        public string Line2 { get; set; }
    }


    [BsonIgnoreExtraElements]
    public class ServiceDetails
    {
        public string Name { get; set; }
        public string Radius { get; set; }
        public List<PriceDetails> Petrol { get; set; }
        public List<PriceDetails> Diesel { get; set; }
        public List<PriceDetails> CNG { get; set; }
        public List<PriceDetails> Electric { get; set; }
        
    }


    public class SelectedService
    {
        public string City { get; set; }
        public string Area { get; set; }
        public string Model { get; set; }
        public List<string> Name { get; set; }
        public string Type { get; set; }
        public string Longitude { get; set; }
        public string Latitude { get; set; }
    }
    //public class Location
    //{
    //    public Location()
    //    {
    //        type = "Point";
    //    }
    //    public string type { get; set; }
    //    public List<Double> coordinates { get; set; }
    //}

    
}
