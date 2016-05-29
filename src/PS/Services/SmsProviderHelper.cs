using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.OptionsModel;
using PS.Helper;

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

        public string GenerateSmsMessages(string type, string value)
        {
            var val = new Dictionary<string, string>();
             var messageString = CreateMessage(type, val);
            return messageString;
        }
        public string GenerateSmsMessages(string type, Dictionary<string, string> values)
        {
            var messageString = CreateMessage(type, values);
            return messageString;
        }
        private string CreateMessage(string type, Dictionary<string, string> values)
        {
            var messageText = GetMessageText(type);
            var dynamicText = new SmsDynamicText();
           foreach (var keyValue in dynamicText.SmsText.Where(keyValue => messageText.Contains(keyValue.Key)))
           {
               string data;
               values.TryGetValue(keyValue.Value, out data);
               messageText = messageText.Replace(keyValue.Key, data);
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
                case "RegSuccess":
                    messageString = MessageProvider.SmsMessages.User.RegistrationCompleted;
                    break;
                default:
                    messageString = "";
                    break;


            }
            return messageString;

        }

    }
}
