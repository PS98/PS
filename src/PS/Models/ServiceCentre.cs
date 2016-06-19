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
    public class Centre : ServiceCentreBaseModel
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
  

    [BsonIgnoreExtraElements]
    public class ServiceCentreGeo
    {
        [JsonIgnore]
        public BsonObjectId _id { get; set; }
        public string Area { get; set; }
        public string CentreId { get; set; }
        public string Name { get; set; }
        public Address Address { get; set; }
        public string PhoneNo { get; set; }
        public string AlternatePhoneNo { get; set; }
        public string Email { get; set; }
        public string Review { get; set; }
        public string OpeningHours { get; set; }
        public string ClosingHours { get; set; }
        public string Longitude { get; set; }
        public string Latitude { get; set; }
        public List<string> Services { get; set; }
        public List<ServiceDetails> ServiceDetails { get; set; }
        [JsonIgnore]
        public Location Location { get; set; }
    }
    [BsonIgnoreExtraElements]
    public class Location
    {
        public Location(string lat, string lng)
        {
            double lat1;
            double lng1;
            Type = "Point";
            double.TryParse(lat, out lat1);
            double.TryParse(lng, out lng1);
            Coordinates = new List<double> {lng1, lat1};
        }
        [BsonElement("coordinates")]
        public List<double> Coordinates { get; set; }
        [BsonElement("type")]
        public string Type { get; set; }
    }





}
