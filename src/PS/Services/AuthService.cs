﻿using MongoDB.Bson;
using MongoDB.Driver;
using PS.Models;
using PS.ViewModels.Account;
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

        public string login(LoginViewModel data)
        {
            try
            {
                if (!string.IsNullOrEmpty(data.Email) && !string.IsNullOrEmpty(data.Password))
                {
                    var modelList = getAll("customer");
                    foreach (var m in modelList)
                    {
                        if (m.Email.ToLower() == data.Email.ToLower())
                        {
                            if(m.Password == data.Password)
                                return m.Username;
                            else
                                return "Incorrect Password";
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
                if (!string.IsNullOrEmpty(data.Username) && !string.IsNullOrEmpty(data.Email) && !string.IsNullOrEmpty(data.Password))
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
                    c.Username = data.Username;
                    c.Email = data.Email;
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

        public bool forgotPassword(ForgotPasswordViewModel data)
        {
            try
            {
                if (!string.IsNullOrEmpty(data.Email))
                {
                    var modelList = getAll("customer");
                    foreach (var m in modelList)
                    {
                        if (m.Email.ToLower() == data.Email.ToLower())
                        {
                            return true;
                        }
                    }
                }
                return false;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}