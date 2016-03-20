using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Models
{
    public class Car
    {
        public ObjectId _id { get; set; }
        public string name { get; set; }
        public List<Varient> varient { get; set; }
    }
    public class Varient
    {
        public string name { get; set; }
        public string Price { get; set; }
        public string Type { get; set; }
    }

    public class CarYearList
    {
        public IEnumerable<IEnumerable<string>> carList { get; set; }

        public List<IEnumerable<int>> yearsList { get; set; }
    }
}
