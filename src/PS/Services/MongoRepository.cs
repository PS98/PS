using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.Linq;
using MongoDB.Driver.Builders;

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
            _database = _client.GetDatabase("car");
        }

        public List<Car> getAll()
        {
            var collection = _database.GetCollection<Car>("Skoda");
            var modelList = collection.Find(new BsonDocument()).ToListAsync().Result;
            return modelList;
        }
        public List<Car> getSelected(string id)
        {
            var collection = _database.GetCollection<Car>("Skoda");
            if (!string.IsNullOrEmpty(id))
            {
                var modelList = collection.Find(b => b._id == new ObjectId(id)).ToListAsync().Result;
                return modelList;
            }
            return new List<Car>();
        }

        //public IQueryable<List<Car>> select()
        //{
        //    var collection = _database.GetCollection<Car>("Skoda");
        //    var query = from c in collection.AsQueryable<Car>()
        //                where c.Type.Contains("Sedan")
        //                select c;

        //    //delete code
        //    var query1 = Query<Car>.EQ(e => e.name, "Rapid");
        //    collection.DeleteOneAsync(query1);
        //    //delete code end

        //    return query;
        //}
        

        public bool insert()
        {
            var collection = _database.GetCollection<Car>("Skoda");
            Car c = new Car();
            c.name = "Test";
            c.Type = "SUV";
            collection.InsertOneAsync(c);
            return true;
        }

        public class Car
        {
            public ObjectId _id { get; set; }
            public string name { get; set; }
            public string Type { get; set; }
        }

     }



}
