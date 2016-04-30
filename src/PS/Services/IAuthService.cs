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
        List<string> register(RegisterViewModel data);
        string forgotPassword(ForgotPasswordViewModel data);
        string changePassword(ChangePasswordViewModel data);
        string updateProfile(UpdateUserProfileViewModel data);
        List<string> SocialLogin(dynamic type);
        int SubcribeUser(dynamic data);
    }
}
