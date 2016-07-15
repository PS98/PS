using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.DTO
{
    [BsonIgnoreExtraElements]
    public class UserSession
    {
        public ObjectId _id { get; set; }
        public string UserId { get; set; }
        public string Token { get; set; }
    }
}
