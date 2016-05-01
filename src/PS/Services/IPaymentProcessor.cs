using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Services
{
    public interface IPaymentProcessor
    {
        RestResponse ValidateOrder(string pId, string pReqId);
        RestResponse OrderPayment(string name, string purpose, int amount, string email, string phone, bool send_email, bool send_sms);
    }
}
