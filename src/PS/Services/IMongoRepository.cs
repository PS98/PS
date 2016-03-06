using System.Collections.Generic;

namespace PS.Services
{
    public  interface IMongoRepository
    {
        List<MongoRepository.Restaurants> getAll();
        List<MongoRepository.Restaurants> getSelected(string id);
        bool insert(MongoRepository.Restaurants rs);
    }
   
}
