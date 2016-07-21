using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Models
{
    public class Customer
    {
        public Customer()
        {
            CustomerType = "M";
        }

        public ObjectId _id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Password { get; set; }
        public string CustomerType { get; set; }
        public bool IsAdmin { get; set; }
        public string CentreId { get; set; }
        public CarDetails CarDetails { get; set; }

    }
}
