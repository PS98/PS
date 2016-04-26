using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PS.Models;

namespace PS.Services
{
    public interface IAuthService
    {
        List<string> login(LoginViewModel data);
        int register(RegisterViewModel data);
        string forgotPassword(ForgotPasswordViewModel data);

        List<string> SocialLogin(dynamic type);
        int SubcribeUser(dynamic data);
    }
}
