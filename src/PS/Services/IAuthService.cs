using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Services
{
    public interface IAuthService
    {
        string login(string email, string password);
    }
}
