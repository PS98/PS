using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PS.Models;
namespace PS.Api.Model
{
    public class FacebookUserProfile
    {
        public FacebookUserProfile()
        {
            CustomerType = "F";
        }
        public string Id { get; set; }
        public string Name { get; set; }
        // ReSharper disable once InconsistentNaming
        public string First_Name { get; set; }
        // ReSharper disable once InconsistentNaming
        public string Last_Name { get; set; }
        public string Link { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public Picture Picture { get; set; }
        public CarDetails CarDetails { get; set; }
        public string CustomerType { get; set; }

        public static ResultUserDto ToResultObject(FacebookUserProfile model)
        {
            var jk = new ResultUserDto
            {
                Email = model.Email,
                FirstName = model.First_Name,
                LastName = model.Last_Name,
                Link = model.Picture.Data.Url,
                CustomerType = model.CustomerType,
                CarDetails = model.CarDetails,
                Name = model.Name
            };

            return jk;
        }
    }
    public class CustomerPreference
    {
        public CarDetails carData { get; set; }
    }
    public class Picture
    {
        public Data Data { get; set; }
    }

    public class Data
    {
        // ReSharper disable once InconsistentNaming
        public bool Is_Silhouette { get; set; }
        public string Url { get; set; }
    }

    
}