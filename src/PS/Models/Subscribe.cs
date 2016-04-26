using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace PS.Models
{
    public class Subscribe
    {
        public ObjectId _id { get; set; }
        public string Name { get; set; }        
        public string Email { get; set; }
    }
}
