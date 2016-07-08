using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Models
{

    public class CarVerientPrice
    {
        public string CentreId { get; set; }
        public string VarientName { get; set; }
        public string EngineType { get; set; }
        public string LiteServicePrice { get; set; }
        public string EssentialServicePrice { get; set; }
        public string ComprehensiveServicePrice { get; set; }

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
