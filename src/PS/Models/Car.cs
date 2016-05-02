using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace PS.Models
{
    [BsonIgnoreExtraElements]
    public class Car
    {
        public ObjectId _id { get; set; }
        public string name { get; set; }
        [BsonElement("varient")]
        public List<Varient> varient { get; set; }
    }
    public class Varient
    {
        [BsonIgnoreIfNull]
        public string name { get; set; }
        [BsonIgnoreIfNull]
        public string Price { get; set; }
        [BsonIgnoreIfNull]
        public string Type { get; set; }
    }

    public class CarYearList
    {
        public IEnumerable<IEnumerable<string>> carList { get; set; }

        public List<IEnumerable<int>> yearsList { get; set; }
    }

    public class UserPreference
    {
        public CarDetails carDetails { get; set; }
        public string Email { get; set; }
        public string CustType { get; set; }
    }
}
