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
using PS.Api.Model;

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
            for (int i = 1990; i <= currYear; i++)
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
        public async void InsertDocument<T>(string databaseName, string collectionName, T data)
        {

            _database = _client.GetDatabase(databaseName);
            var collection = _database.GetCollection<T>(collectionName);
            await collection.InsertOneAsync(data);
        }

        public string UpdateCarDetailsIntoCollection(string custType, UserPreference model)
        {
            var repo = new MongoRepository("auth");

            var filterDic = new Dictionary<string, string>();
            filterDic.Add("Email", model.Email);

            var updateDic = new Dictionary<string, object>();
            updateDic.Add("CarDetails", model.carDetails);

            if (custType.Equals("F"))
            {
                var facebookCollection = repo.GetCollection<FacebookUserProfile>("Facebook Customer");
                UpdateDocumentWithFilter(filterDic, updateDic, facebookCollection);
                return "S";
            }
            else if (custType.Equals("G"))
            {
                var googleCollection = repo.GetCollection<GoogleUserProfile>("Facebook Customer");
                UpdateDocumentWithFilter(filterDic, updateDic, googleCollection);
                return "S";
            }

            var collection = repo.GetCollection<Customer>("customer");
            UpdateDocumentWithFilter(filterDic, updateDic, collection);
            return "S";

        }

        public async void  UpdateDocumentWithFilter<T>(Dictionary<string, string> filterDic, Dictionary<string, object> updateDic, IMongoCollection<T> collection)
        {
            try
            {
                FilterDefinition<T> filter = null;
                UpdateDefinition<T> update = null;
                var updates = new List<UpdateDefinition<T>>();
                foreach (var fil in filterDic)
                {
                    if(filter == null)
                    filter = Builders<T>.Filter.Eq(fil.Key, fil.Value);
                    else
                    {
                        filter = filter & Builders<T>.Filter.Eq(fil.Key, fil.Value);
                    }

                }
                foreach (var upDoc in updateDic)
                {
                    //if(update == null)
                    //    update = Builders<T>.Update.Set(upDoc.Key, upDoc.Value);
                    //else
                    //{
                    //update.A(upDoc.Key, upDoc.Value);
                    //}
                    updates.Add(Builders<T>.Update.Set(upDoc.Key, upDoc.Value));
                }

                await collection.UpdateOneAsync(filter, Builders<T>.Update.Combine(updates.ToArray()));
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public List<OrderDetails> GetOrderOnStatus(string status, string email)
        {
            FilterDefinition<OrderDetails> filter;
            if (status.Equals("Success"))
            {
                filter = Builders<OrderDetails>.Filter.Where(x => x.UserDetails.Email == email && (x.Status == status || x.Status == "Cancelled"));
            }
            else
                filter = Builders<OrderDetails>.Filter.Where(x => x.UserDetails.Email == email && (x.Status == status));
            var collection = _database.GetCollection<OrderDetails>("Invoice");
            var documentList = collection.Find(filter).ToListAsync().Result;
            return documentList;
        }
        public List<List<OrderDetails>>  GetAllOrderWithStatus(string email)
        {
            try
            {
                var filter = Builders<OrderDetails>.Filter.Where(x => x.UserDetails.Email == email);
                var collection = _database.GetCollection<OrderDetails>("Invoice");
                var orderList = collection.Find(filter).ToListAsync().Result;

                var orders = new List<List<OrderDetails>>
                {
                    orderList.Where(x => x.Status.Equals("Pending")).OrderByDescending(x =>x.BookingDate).ToList(),
                    orderList.Where(x => x.Status != "Pending").OrderByDescending(x =>x.BookingDate).ToList()
                };
                return orders;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public List<List<OrderDetails> >CancelSelectedOrder(string invoiceNo, string email, bool listOrder)
        {
            var collection = _database.GetCollection<OrderDetails>("Invoice");

            var filterDic = new Dictionary<string, string> {{"InvoiceNo", invoiceNo}};

            var updateDic = new Dictionary<string, object> {{"Status", "Cancelled"}, {"CancellationDate", DateTime.Now}};

            UpdateDocumentWithFilter<OrderDetails>(filterDic, updateDic, collection);
            return listOrder ? GetAllOrderWithStatus(email) : new List<List<OrderDetails>>();
        }
        public static string RandomNumber(int length)
        {
            const string chars = "0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

    public string GenerateNewId()
        {
            var randomNumber = RandomNumber(4);
            var date = DateTime.Now;
            return randomNumber + date.ToString("MM") + date.ToString("dd");
        }

        public void ChangeAppointmentDate(string invoiceNo, Appointment newAppointment)
        {
            var collection = _database.GetCollection<OrderDetails>("Invoice");
            var filter = Builders<OrderDetails>.Filter.Eq("InvoiceNo", invoiceNo);
            var update = Builders<OrderDetails>.Update.Set("selectedAppointment", newAppointment);
            collection.UpdateOneAsync(filter, update);

        }

        public List<T> GetFilterList<T>(FilterDefinition<T> filterDefinition, string collectionName)
        {
            var collection = _database.GetCollection<T>(collectionName);
            var documentList = collection.Find(filterDefinition).ToListAsync().Result;
            return documentList;
        }
    }
}
