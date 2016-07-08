using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Helper
{
    public static class Utility
    {
        public  const string LiteCarCare = "Lite Car Care";
        public const string EssentialCarCare = "Essential Car Care";
        public const string ComprehensiveCarCare = "Comprehensive Car Care";
        public static int GetDay(string day)
        {
            if (string.IsNullOrEmpty(day))
                return 7;
            if (day.ToLower().Equals("monday"))
                return 1;
            if (day.ToLower().Equals("tuesday"))
                return 2;
            if (day.ToLower().Equals("wednesday"))
                return 3;
            if (day.ToLower().Equals("thursday"))
                return 4;
            if (day.ToLower().Equals("friday"))
                return 5;
            if (day.ToLower().Equals("sturday"))
                return 6;
            if (day.ToLower().Equals("sunday"))
                return 0;
            return 7;
        }

        public static int GetMileMatesMargin(string serviceName)
        {
            int margin;
            switch (serviceName)
            {
                case LiteCarCare:
                    margin = 99;
                    break;
                case EssentialCarCare:
                    margin = 299;
                    break;
                case ComprehensiveCarCare:
                    margin = 499;
                    break;
                default:
                    margin = 99;
                    break;

            }
            return margin;
        }

        public static int GenerateRandomNo(int price, string service)
        {
            var r = new Random();
            var low = price + GetMileMatesMargin(service) + 200;
            var high = price + GetPrice(service);
             var randomNo = r.Next(low,high);
            return randomNo;

        }

        private static int GetPrice(string serviceName)
        {
            int price;
            switch (serviceName)
            {
                case LiteCarCare:
                    price = 500;
                    break;
                case EssentialCarCare:
                    price = 2000;
                    break;
                case ComprehensiveCarCare:
                    price = 3000;
                    break;
                default:
                    price = 99;
                    break;

            }
            return price;
        }
    }
}
