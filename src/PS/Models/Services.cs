using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PS.Models
{
    [BsonIgnoreExtraElements]
    public class Services
    {
   
        public ObjectId _id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Type> Type { get; set; }
    }

    public class Type
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }



    public class ServiceList
    {
        public ServiceList()
        {
            ServiceDetails = new List<List<Services>>();
        }

        public string[] ServiceName { get; set; }
        public List<List<Services>> ServiceDetails { get; set; }
    }

}
