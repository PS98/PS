using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.OptionsModel;

namespace PS.Services
{
    public class SmsProviderHelper
    {
        public SmsProviderHelper(IOptions<SmsMessageProvider> valueOptions)
        {
            MessageProvider = valueOptions.Value;
        }

        public SmsMessageProvider MessageProvider { get; }

        //public void SendSms(string mobileNo,string smsType)
        //{
        //  var message =  GenerateSmsMessages(smsType);

        //}

        public string GenerateSmsMessages(string type, string otp)
        {
            var messageString = CreateMessage(type, otp);
            return messageString;
        }
        public string GenerateSmsMessages(string type, string otp,string email)
        {
            var messageString = CreateMessage(type, otp);
            return messageString;
        }
        private string CreateMessage(string type, string otp)
        {
            var messageText = GetMessageText(type);
            if (messageText.Contains("{Otp}"))
            {
                messageText = messageText.Replace("{Otp}", otp);
            }
            return messageText;
        }

        private string GetMessageText(string type)

        {
            string messageString;
            switch (type)
            {
                case "RegOtp":
                    messageString = MessageProvider.SmsMessages.User.RegistrationOtp;
                    break;
                default:
                    messageString = "";
                    break;


            }
            return messageString;

        }

    }
}
