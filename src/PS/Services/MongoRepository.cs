using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.Linq;
using Newtonsoft.Json;
using System.Reflection;
//using MongoDB.Driver.Builders;
using PS.Models;

namespace PS.Services
{
    public class MongoRepository : IMongoRepository
    {
        protected static IMongoClient _client;
        protected static IMongoDatabase _database;
        private const string conString = "mongodb://localhost:27017";

        public MongoRepository(string database)
        {
            _client = new MongoClient(conString);
            _database = _client.GetDatabase(database);
        }

        public IMongoCollection<T> GetCollection<T>(string collectionName)
        {
            var collection = _database.GetCollection<T>(collectionName);
            return collection;
        }


        public List<T> GetDocumentList<T>(string collectionName)
        {
            var collection = _database.GetCollection<T>(collectionName);
            var documentList = collection.Find(new BsonDocument()).ToListAsync().Result;
            return documentList;
        }

        public List<string> GetAllCollectionName()
        {
            var list = _database.ListCollectionsAsync().Result.ToListAsync().Result;
            var bson = (BsonExtensionMethods.ToJson(list));
            var bsonDictionary = JsonConvert.DeserializeObject<List<Dictionary<string, dynamic>>>(bson);

            return bsonDictionary.Select(i => i.Values.First()).Cast<string>().ToList();
        }

        public IEnumerable<IEnumerable<string>> convertToPresentationList(List<string> collectionList)

        {
            int take, skip, divisor;
            List<IEnumerable<string>> listAll = new List<IEnumerable<string>>();
            collectionList.Sort();

            divisor = collectionList.Count < 10 ? 3 : 4;

            take = (collectionList.Count + divisor - 1) / divisor;

            for (int i = 0; i < divisor; i++)
            {
                skip = i * take;
                listAll.Add(collectionList.Skip(skip).Take(take).ToList());

            }

            return listAll;
        }


        public List<IEnumerable<int>> getYears()
        {
            var yearsList = new List<int>();
            int take, skip, divisor;
            var currYear = DateTime.Now.Year;
            for(int i = 1990; i<= currYear; i++)
            {
                yearsList.Add(i);
            }

            yearsList.Sort();
            List<IEnumerable<int>> listAll = new List<IEnumerable<int>>();

            divisor = yearsList.Count < 10 ? 3 : 4;

            take = (yearsList.Count + divisor - 1) / divisor;

            for (int i = 0; i < divisor; i++)
            {
                skip = i * take;
                listAll.Add(yearsList.Skip(skip).Take(take).ToList());

            }

            return listAll;
        }
    }
}
