using MongoDB.Bson;
using MongoDB.Driver;
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
        private MongoRepository _repo = new MongoRepository("auth");
        //public AuthService()
        //{

        //    repo = new MongoRepository("auth");
        //}

        public List<Customer> getAll(string colletionName)
        {
            return _repo.GetDocumentList<Customer>(colletionName);
        }
        
            public List<Subscribe> getAllSubscribers(string colletionName)
        {
            return _repo.GetDocumentList<Subscribe>(colletionName);
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
                                res.Add(m.Mobile);
                                res.Add(m.IsAdmin.ToString());
                                res.Add(m.CentreId);
                                if(m.IsAdmin && m.CentreId == "0")
                                {
                                    res.Add("0");
                                }
                                else if(m.IsAdmin)
                                {
                                    res.Add("1");
                                }
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

        public List<string> register(RegisterViewModel data)
        {
            List<string> res = new List<string>();
            try {
                if (!string.IsNullOrEmpty(data.FirstName) && !string.IsNullOrEmpty(data.LastName) && !string.IsNullOrEmpty(data.Email) && !string.IsNullOrEmpty(data.Password))
                {
                    var modelList = getAll("customer");
                    foreach (var m in modelList)
                    {
                        if (m.Email.ToLower() == data.Email.ToLower())
                        {
                            res.Add("1");                 
                            return res;
                        }
                    }
                    var collection = _repo.GetCollection<Customer>("customer");
                    Customer c = new Customer();
                    c.FirstName = data.FirstName;
                    c.LastName = data.LastName;
                    c.Email = data.Email;
                    c.Mobile = data.Mobile;
                    c.Password = data.Password;
                    collection.InsertOneAsync(c);
                    res.Add("0");
                    res.Add(data.Email);
                    res.Add(data.FirstName);
                    res.Add(data.LastName);
                    res.Add(data.Mobile);
                    return res;
                }
                res.Add("2");
                return res;
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
                    var modelList = _repo.GetCollection<Customer>("customer");
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

        public string updateProfile(UpdateUserProfileViewModel data)
        {
            try
            {
                List<string> res = new List<string>();
                if (!string.IsNullOrEmpty(data.Email))
                {
                    var modelList = _repo.GetCollection<Customer>("customer");

                    foreach (var doc in modelList.Find(new BsonDocument()).ToListAsync().Result.Where(x => x.Email.ToLower() == data.Email.ToLower()))
                    {                        
                            var filter = Builders<Customer>.Filter.Eq("Email", doc.Email);
                            var update = Builders<Customer>.Update
                                .Set("FirstName", data.FirstName)
                                .Set("LastName",data.LastName)
                                .Set("Mobile", data.Mobile);
                            var result = modelList.UpdateOneAsync(filter, update);
                            return "S";                       
                    }
                }
                return null;
            }
            catch (Exception)
            {
                throw;
            }
        }


        public string changePassword(ChangePasswordViewModel data)
        {
            try
            {
                List<string> res = new List<string>();
                if (!string.IsNullOrEmpty(data.Email))
                {
                    var modelList = _repo.GetCollection<Customer>("customer");

                    foreach (var doc in modelList.Find(new BsonDocument()).ToListAsync().Result.Where(x=>x.Email.ToLower() == data.Email.ToLower()))
                    {
                        if (doc.Password.Equals(data.OldPassword)) { 
                            var filter = Builders<Customer>.Filter.Eq("Email", doc.Email);
                            var update = Builders<Customer>.Update
                                .Set("Password", data.NewPassword);
                            var result = modelList.UpdateOneAsync(filter, update);
                            return "S";
                        }
                        else
                        {
                            return "E";
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

        public ResultUserDto SocialLogin(dynamic model)
        {
            var rep = new MongoRepository("auth");
           var  data = new ResultUserDto();
            if (model is GoogleUserProfile)
            {
                var collection = rep.GetCollection<GoogleUserProfile>("Google Customer");

                //  var filter = Builders<BsonDocument>.Filter.Eq("Email", "");
                var customerList = collection?.Find(new BsonDocument()).ToListAsync().Result;
                if (customerList?.Where(e => e.Email == model.Email).ToList().Count == 0)
                {
                    collection.InsertOneAsync(model);

                   // return (object)model;
                }
                else {
                    foreach (var i in customerList?.Where(e => e.Email == model.Email).ToList())
                    {
                        //data.Add(i.Given_Name);
                        //data.Add(i.Name);
                        //data.Add(i.Picture);
                        //data.Add(i.Email);
                        //return data;
                    }
                }
                return GoogleUserProfile.ToResultObject(model);
            }
            if (model is FacebookUserProfile)
            {
                var collection = rep.GetCollection<FacebookUserProfile>("Facebook Customer");
                var customerList = collection?.Find(new BsonDocument()).ToListAsync().Result;
                if (customerList?.Where(e => e.Email == model.Email).ToList().Count == 0)
                {
                    collection.InsertOneAsync(model);

                   // return model.ToJson();
                }
                else {
                    foreach(var i in customerList?.Where(e => e.Email == model.Email).ToList())
                    {
                        //data.Add(i.First_Name);
                        //data.Add(i.Name);
                        //data.Add(i.Picture.Data.Url);
                        //data.Add(i.Email);
                        //return data;
                    } 
                }
                return FacebookUserProfile.ToResultObject(model);
            }
            return null;
        }



        //subcribeUser function for new subscribers


        public int SubcribeUser(dynamic data)
        {
            var rep = new MongoRepository("auth");
            try
            {
                if (!string.IsNullOrEmpty(data.Name) && !string.IsNullOrEmpty(data.Email))
                {
                    var modelList = getAllSubscribers("subscribers");
                    foreach (var m in modelList)
                    {
                        if (m.Email.ToLower() == data.Email.ToLower())
                        {
                            return 1;
                        }
                    }
                    var collection = _repo.GetCollection<Subscribe>("subscribers");
                    Subscribe c = new Subscribe();
                    c.Name = data.Name;                   
                    c.Email = data.Email;
                    c.Created = data.Created;                   
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




    }
}

