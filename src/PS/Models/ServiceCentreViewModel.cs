using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace PS.Models
{
    public class ServiceCentreViewModel : ServiceCentreBaseModel
    {
        public int TotalMMPrice { get; set; }
        public int TotalActualPrice { get; set; }
        public bool IsFreePickUp { get; set; }
       

        private double _distance;

        public double Distance {

            get

            { return this._distance; }

            set

            {
                this._distance = Math.Round(value,2);

            }
        }
        public List<Detalis> ServiceDetails { get; set; }
    }
    public class Detalis
    {
        public string Name { get; set; }
        [JsonIgnore]
        public bool IsFreePickUp { get; set; }
        public int MilematePrice { get; set; }
        public int ActualPrice { get; set; }
    }
}
