using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PS.Models;
namespace PS.Api.Model
{
    public class GoogleUserProfile
    {
        public GoogleUserProfile()
        {
            CustomerType = "G";
        }
        public string Id { get; set; }
        public string Name { get; set; }
        public string Given_Name { get; set; }
        public string Family_Name { get; set; }
        public string Link { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string Picture { get; set; }
        public string CustomerType { get; set; }
        public CarDetails carData { get; set; }

    }
}