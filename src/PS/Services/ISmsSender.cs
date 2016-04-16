using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Services
{
    public interface ISmsSender
    {
        bool SendSmsAsync(string number, string message);
    }
}
