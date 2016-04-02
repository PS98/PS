using System.Collections.Generic;
using MongoDB.Driver.Linq;
using System.Linq;
using MongoDB.Driver;
using PS.Models;

namespace PS.Services
{
    public  interface IMongoRepository
    {
        List<T> GetDocumentList<T>(string collectionName);
        IMongoCollection<T> GetCollection<T>(string collectionName);
        List<string> GetAllCollectionName();
    }
   
}
