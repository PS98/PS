using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Model
{
    public class GoogleUserProfile
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Given_Name { get; set; }
        public string Family_Name { get; set; }
        public string Link { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string Picture { get; set; }
    }
}