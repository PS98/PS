using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Model
{
    public class FacebookUserProfile
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string First_Name { get; set; }
        public string Last_Name { get; set; }
        public string Link { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public Picture Picture { get; set; }
    }

    public class Picture
    {
        public Data Data { get; set; }
    }

    public class Data
    {
        public bool Is_Silhouette { get; set; }
        public string Url { get; set; }
    }
}