using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace PS.Services
{
    public class MongoRepository : IMongoRepository
    {
        protected static IMongoClient _client;
        protected static IMongoDatabase _database;
        private const string conString = "mongodb://localhost:27017";

        public MongoRepository()
        {
            _client = new MongoClient(conString);
            _database = _client.GetDatabase("test");
        }

        public List<Restaurants> getAll()
        {


            var collections = _database.GetCollection<Restaurants>("restaurants");
            var resutantList = collections.Find(new BsonDocument()).ToListAsync().Result;
            return resutantList;
        }
        public List<Restaurants> getSelected(string id)
        {
            var collections = _database.GetCollection<Restaurants>("restaurants");
            // id = new ObjectId(id);
            if (!string.IsNullOrEmpty(id))
            {
                var resutantList = collections.Find(b => b._id == new ObjectId(id)).ToListAsync().Result;
                return resutantList;
            }
            return new List<Restaurants>();
        }

        public bool insert(Restaurants rs)
        {
            var collections = _database.GetCollection<Restaurants>("restaurants");
          //  collections.InsertOneAsync();
            return true;
        }

        public class Restaurants
        {
            public ObjectId _id { get; set; }
            public Address address { get; set; }
            public string borough { get; set; }
            public string cuisine { get; set; }
            public List<Grade> grades { get; set; }
            public string name { get; set; }
            public string restaurant_id { get; set; }
        }

        public class Address
        {
            public string building { get; set; }
            [BsonRepresentation(BsonType.Double)]
            public double[] coord { get; set; }
            public string street { get; set; }
            public string zipcode { get; set; }
        }

        public class Grade
        {
            [BsonRepresentation(BsonType.DateTime)]
            public DateTime date { get; set; }
            public string grade { get; set; }
            [BsonIgnoreIfNull]
            public int score { get; set; }
        }

    }



}
