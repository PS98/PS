using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PS.Models
{
    [BsonIgnoreExtraElements]
    public class ServiceCentre
    {
        public BsonObjectId _id { get; set; }
        public string Area { get; set; }
        public List<Centre> Centres { get; set; }
    }

    public class Centre
    {
        public string Name { get; set; }
        public Address Address { get; set; }
        public string PhoneNo { get; set; }
        public string Longitude { get; set; }
        public string Latitude { get; set; }
        public int TotalPrice { get; set; }
        public List<ServiceDetails> ServiceDetails { get; set; }
    }

    public class Address
    {
        [BsonElement("line1")]
        public string Line1 { get; set; }
        [BsonElement("line2")]
        public string Line2 { get; set; }
    }

    public class SelectedService

    {
        public string City { get; set; }
        public string Area { get; set; }
        public string Model { get; set; }
        public List<string> Name { get; set; } 
        public string Varient { get; set; }

    }
    [BsonIgnoreExtraElements]
    public class ServiceDetails
    {
        public string Name { get; set; }
        public int Price { get; set; }
        public List<PriceDetails> PriceDetails { get; set; }
    }
    [BsonIgnoreExtraElements]
    public class PriceDetails
    {
        public List<string> ModelList { get; set; }
        public List<VarientList> VarientList { get; set; }
        public int Price { get; set; }
    }
    [BsonIgnoreExtraElements]
    public class VarientList
    {
        public List<string> Varient { get; set; }
        public int Price { get; set; }
    }

}
