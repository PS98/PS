using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace PS.Models
{
    [BsonIgnoreExtraElements]
    public class ServiceCentreBaseModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Address Address { get; set; }
       // [JsonIgnore]
        public string Email { get; set; }
        public string PhoneNo { get; set; }
        public string Longitude { get; set; }
        public string Latitude { get; set; }
        public string Review { get; set; }
        public List<string> Services { get; set; }

    }
    [BsonIgnoreExtraElements]
    public class PriceDetails
    {
        public List<string> ModelList { get; set; }
        public int MilematePrice { get; set; }
        public int ActualPrice { get; set; }
        public int ServiceCentrePrice { get; set; }
    }
}
