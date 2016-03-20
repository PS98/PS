using System.Collections.Generic;
using MongoDB.Driver.Linq;
using System.Linq;
using PS.Models;

namespace PS.Services
{
    public  interface IMongoRepository
    {
        List<Car> getAll(string colletionName);
        List<string> getAll();
        List<Car> getSelected(string id);
        bool insert();
        //  IQueryable<List<MongoRepository.Car>> select();
        List<string> getTypeFromCollection(string type);
    }
   
}
