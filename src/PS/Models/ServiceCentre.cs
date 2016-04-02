using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PS.Models
{
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
    }

    public class Address
    {
        [BsonElement("line1")]
        public string Line1 { get; set; }
        [BsonElement("line2")]
        public string Line2 { get; set; }
    }

}
