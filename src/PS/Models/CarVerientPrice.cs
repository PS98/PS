using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Models
{

    public class CarVerientPrice
    {
        public string VarientName { get; set; }
        public string EngineType { get; set; }
        public int LiteServicePrice { get; set; }
        public int EssentialServicePrice { get; set; }
        public int ComprehensiveServicePrice { get; set; }

    }
    public class CentrePriceDetails
    {
        public string BrandName { get; set; }
        public List<CarVerientPrice> VarientList { get; set; }
    }

    public class ServicePriceDetails
    {
        public string Name { get; set; }
        public int Price { get; set; }
    }
}
