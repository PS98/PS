using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Services
{
    public interface IEmailSender
    {

        RestResponse SendSimpleMessage(string email, string subject, string message);
    }
}
