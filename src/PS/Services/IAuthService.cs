using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PS.Models;
using PS.ViewModels.Account;

namespace PS.Services
{
    public interface IAuthService
    {
        string login(LoginViewModel data);
        int register(RegisterViewModel data);
        bool forgotPassword(ForgotPasswordViewModel data);

        string SocialLogin(dynamic type);
    }
}
