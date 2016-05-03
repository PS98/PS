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
        public CarDetails CarDetails { get; set; }


        public static ResultUserDto ToResultObject(GoogleUserProfile model)
        {
            ResultUserDto jk = new ResultUserDto();

            jk.Email = model.Email;
            jk.FirstName = model.Given_Name;
            jk.LastName = model.Family_Name;
            jk.Link = model.Picture;
            jk.CustomerType = model.CustomerType;
            jk.CarDetails = model.CarDetails;
            jk.Name = model.Name;
            return jk;
        }
    }
    public class ResultUserDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string CustomerType { get; set; }
        public CarDetails CarDetails { get; set; }
        public string Link { get; set; }
        public string Name { get; set; }
    }

   
}