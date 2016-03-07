using System.Collections.Generic;
using MongoDB.Driver.Linq;
using System.Linq;

namespace PS.Services
{
    public  interface IMongoRepository
    {
        List<MongoRepository.Car> getAll(string colletionName);
        List<MongoRepository.Car> getSelected(string id);
        bool insert();
        //  IQueryable<List<MongoRepository.Car>> select();
        List<string> getTypeFromCollection(string type);
    }
   
}
