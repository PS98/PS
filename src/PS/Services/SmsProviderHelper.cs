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

        public string GenerateSmsMessages(string type)
        {
            var messageText = GetMessageText(type);
            return messageText;
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
                case SmsType.RegistrationOtp:
                    messageString = MessageProvider.SmsMessages.User.RegistrationOtp;
                    break;
                case SmsType.RegistrationCompleted:
                    messageString = MessageProvider.SmsMessages.User.RegistrationCompleted;
                    break;
                case SmsType.BookingSuccess:
                    messageString = MessageProvider.SmsMessages.User.BookingSuccess;
                    break;
                case SmsType.BookingCancelled:
                    messageString = MessageProvider.SmsMessages.User.BookingCancelled;
                    break;
                case SmsType.DropOffInitiated:
                    messageString = MessageProvider.SmsMessages.User.DropOffInitiated;
                    break;
                case SmsType.PickUpDone:
                    messageString = MessageProvider.SmsMessages.User.PickUpDone;
                    break;
                case SmsType.PickUpSuccess:
                    messageString = MessageProvider.SmsMessages.User.PickUpSuccess;
                    break;
                case SmsType.PaymentDone:
                    messageString = MessageProvider.SmsMessages.User.PaymentDone;
                    break;
                case SmsType.ServiceCompleted:
                    messageString = MessageProvider.SmsMessages.User.ServiceCompleted;
                    break;
                case SmsType.ServicingConfirmation:
                    messageString = MessageProvider.SmsMessages.ServiceCentre.ServicingConfirmation;
                    break;
                case SmsType.Offer:
                    messageString = MessageProvider.SmsMessages.User.Offer;
                    break;
                default:
                    messageString = "";
                    break;


            }
            return messageString;

        }

    }
}
