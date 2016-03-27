using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PS.Models;
using PS.Models;

namespace PS.Services
{
    public interface IAuthService
    {
        string login(LoginViewModel data);
        int register(RegisterViewModel data);
        bool forgotPassword(ForgotPasswordViewModel data);

        List<string> SocialLogin(dynamic type);
    }
}
