using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Services
{
    public class AuthService: IAuthService
    {
        protected static IMongoClient _client;
        protected static IMongoDatabase _database;
        private const string conString = "mongodb://localhost:27017";

        public AuthService()
        {
            _client = new MongoClient(conString);
            _database = _client.GetDatabase("auth");
        }

        public List<Customer> getAll(string colletionName)
        {
            var collection = _database.GetCollection<Customer>(colletionName);
            var modelList = collection.Find(new BsonDocument()).ToListAsync().Result;
            return modelList;
        }

        public string login(string email, string password)
        {
            if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(password))
            {
                List<string> typeArray = new List<string>();
                    var modelList = getAll("customer");
                    foreach (var m in modelList)
                    {
                        if(m.Email.ToLower() == email.ToLower() && m.Password == password)
                        {
                            return m.Username;
                        }
                    }
            }
            return null;
        }

        public class Customer
        {
            public ObjectId _id { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }
    }
}
