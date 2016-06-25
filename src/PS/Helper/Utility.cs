using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Helper
{
    public static class Utility
    {
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
    }
}
