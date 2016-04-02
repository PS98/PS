using MongoDB.Bson;
using MongoDB.Driver;
using PS.Models;
using PS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting;
using System.Threading.Tasks;
using PS.Api.Model;
using Newtonsoft.Json;

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

        public List<string> login(LoginViewModel data)
        {
            List<string> res = new List<string>();
            try
            {
                if (!string.IsNullOrEmpty(data.Email) && !string.IsNullOrEmpty(data.Password))
                {
                    var modelList = getAll("customer");
                    foreach (var m in modelList)
                    {
                        if (m.Email.ToLower() == data.Email.ToLower())
                        {
                            if (m.Password == data.Password)
                            {
                                res.Add(m.Email);
                                res.Add(m.FirstName);
                                res.Add(m.LastName);
                                return res;
                            }
                            else
                                res.Add(m.Email);
                                res.Add("");
                                return res;
                        }
                    }
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public int register(RegisterViewModel data)
        {
            try {
                if (!string.IsNullOrEmpty(data.FirstName) && !string.IsNullOrEmpty(data.LastName) && !string.IsNullOrEmpty(data.Email) && !string.IsNullOrEmpty(data.Password))
                {
                    var modelList = getAll("customer");
                    foreach (var m in modelList)
                    {
                        if (m.Email.ToLower() == data.Email.ToLower())
                        {
                            return 1;
                        }
                    }
                    var collection = _database.GetCollection<Customer>("customer");
                    Customer c = new Customer();
                    c.FirstName = data.FirstName;
                    c.LastName = data.LastName;
                    c.Email = data.Email;
                    c.Mobile = data.Mobile;
                    c.Password = data.Password;
                    collection.InsertOneAsync(c);
                    return 0;
                }
                return 2;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string forgotPassword(ForgotPasswordViewModel data)
        {
            try
            {
                List<string> res = new List<string>();
                if (!string.IsNullOrEmpty(data.Email))
                {
                    var modelList = _database.GetCollection<Customer>("customer");
                    foreach (var m in modelList.Find(new BsonDocument()).ToListAsync().Result)
                    {
                        if (m.Email.ToLower() == data.Email.ToLower())
                        {
                            var pass = RandomString(8);
                            var filter = Builders<Customer>.Filter.Eq("Email", m.Email);
                            var update = Builders<Customer>.Update
                                .Set("Password", pass);
                            var result = modelList.UpdateOneAsync(filter, update);
                            return pass;
                        }
                    }
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        private static string RandomString(int length)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public List<string> SocialLogin(dynamic T)
        {
            var rep = new MongoRepository();
            List<string> data = new List<string>();
            if (T is GoogleUserProfile)
            {
                var collection = rep.GetCollection<GoogleUserProfile>("googleCustomer", "customer");

                //  var filter = Builders<BsonDocument>.Filter.Eq("Email", "");
                var customerList = collection?.Find(new BsonDocument()).ToListAsync().Result;
                if (customerList?.Where(e => e.Email == T.Email).ToList().Count == 0)
                {
                    collection.InsertOneAsync(T);

                    return T.ToJson();
                }
                else {
                    foreach (var i in customerList?.Where(e => e.Email == T.Email).ToList())
                    {
                        data.Add(i.Given_Name);
                        data.Add(i.Name);
                        data.Add(i.Picture);
                        data.Add(i.Email);
                        return data;
                    }
                }
            }
             if (T is FacebookUserProfile)
            {
                var collection = rep.GetCollection<FacebookUserProfile>("facebookCustomer", "customer");
                var customerList = collection?.Find(new BsonDocument()).ToListAsync().Result;
                if (customerList?.Where(e => e.Email == T.Email).ToList().Count == 0)
                {
                    collection.InsertOneAsync(T);

                    return T.ToJson();
                }
                else {
                    foreach(var i in customerList?.Where(e => e.Email == T.Email).ToList())
                    {
                        data.Add(i.First_Name);
                        data.Add(i.Name);
                        data.Add(i.Picture.Data.Url);
                        data.Add(i.Email);
                        return data;
                    } 
                }
            }
            return null;
        }


    }
}

