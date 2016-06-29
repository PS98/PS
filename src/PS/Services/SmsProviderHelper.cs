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
                case SmsType.BookingRemainder:
                    messageString = MessageProvider.SmsMessages.User.BookingRemainder;
                    break;
                case SmsType.QuotationAccepted:
                    messageString = MessageProvider.SmsMessages.User.QuotationAccepted;
                    break;
                case SmsType.QuotationRejected:
                    messageString = MessageProvider.SmsMessages.User.QuotationRejected;
                    break;
                case SmsType.ServicingQuotationAccepted:
                    messageString = MessageProvider.SmsMessages.ServiceCentre.ServicingQuotationAccepted;
                    break;
                case SmsType.ExtraAmount:
                    messageString = MessageProvider.SmsMessages.User.ExtraAmount;
                    break;
                case SmsType.DropOffDone:
                    messageString = MessageProvider.SmsMessages.User.DropOffDone;
                    break;
                case SmsType.ServicingQuotationRejected:
                    messageString = MessageProvider.SmsMessages.ServiceCentre.ServicingQuotationRejected;
                    break;
                case SmsType.ServiceCodPayment:
                    messageString = MessageProvider.SmsMessages.ServiceCentre.ServiceCodPayment;
                    break;
                case SmsType.ServiceOnlinePayment:
                    messageString = MessageProvider.SmsMessages.ServiceCentre.ServiceOnlinePayment;
                    break;
                case SmsType.ServicePickRemainder:
                    messageString = MessageProvider.SmsMessages.ServiceCentre.ServicePickRemainder;
                    break;
                case SmsType.ServiceDropRemainder:
                    messageString = MessageProvider.SmsMessages.ServiceCentre.ServiceDropRemainder;
                    break;
                case SmsType.ServiceOrderUpdate:
                    messageString = MessageProvider.SmsMessages.ServiceCentre.ServiceOrderUpdate;
                    break;
                case SmsType.ServiceOrderCancel:
                    messageString = MessageProvider.SmsMessages.ServiceCentre.ServiceOrderCancel;
                    break;
              default:
                    messageString = "";
                    break;


            }
            return messageString;

        }

    }
}
