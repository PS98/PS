using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PS.Models;
using PS.Api.Model;

namespace PS.Services
{
    public interface IAuthService
    {
        List<string> login(LoginViewModel data);
        List<string> register(RegisterViewModel data);
        string forgotPassword(ForgotPasswordViewModel data);
        string changePassword(ChangePasswordViewModel data);
        string updateProfile(UpdateUserProfileViewModel data);
        ResultUserDto SocialLogin(dynamic type);
        int SubcribeUser(dynamic data);
    }
}
