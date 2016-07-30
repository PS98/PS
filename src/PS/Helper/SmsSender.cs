using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.OptionsModel;
using PS.Models;
using PS.Services;

namespace PS.Helper
{
    public class SmsSender
    {
        private static ISmsSender _smsSender;
        private static SmsProviderHelper _smsProviderHelper;

        #region Customer 
        public SmsSender(ISmsSender smsSender, SmsProviderHelper messageProvider)
        {
            _smsSender = smsSender;
            _smsProviderHelper = messageProvider;
        }

        public static void SendOtpSms(string mobileNo, string otp)
        {
            try
            {
                var values = new Dictionary<string, string> { { SmsDynamicText.Otp, otp } };
                var messge = _smsProviderHelper.GenerateSmsMessages(SmsType.RegistrationOtp, values);
                _smsSender.SendSmsAsync(mobileNo, messge);
            }
            catch (Exception)
            {
                // ignored
            }
        }

        public static void RegistrationSuccessfull(string mobileNo, string name)
        {
            try
            {
                var values = new Dictionary<string, string> { { SmsDynamicText.UserName, name } };
                var messge = _smsProviderHelper.GenerateSmsMessages(SmsType.RegistrationCompleted, values);
                _smsSender.SendSmsAsync(mobileNo, messge);
                if (!string.IsNullOrEmpty(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo))
                    _smsSender.SendSmsAsync(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo, messge);
            }
            catch (Exception)
            {
                // ignored
            }
        }

        public static void BookingSuccessfull(OrderDetails model)
        {
            try
            {
                var serviceList = model.SelectedServices.Select(x => x.Name).ToArray();
                var serviceName = string.Join(",", serviceList);
                var centreNameAndAddress = model.SelectedCentre.Name + ", " + model.SelectedCentre.Address.Line1 +
                                           model.SelectedCentre.Address.Line2 + " "
                                           + model.SelectedCentre.PhoneNo;
                var date = model.SelectedAppointment.PickUpDate.Day + "(" + model.SelectedAppointment.PickUpDate.Time +
                           ")";
                var vehical = model.SelectedCar.Brand + "-" + model.SelectedCar.Model + "-" + model.SelectedCar.Varient;
                var messageText = new Dictionary<string, string>
                {
                    {SmsDynamicText.BookingId, model.InvoiceNo},
                    {SmsDynamicText.ServiceName, serviceName},
                    {SmsDynamicText.PickUpDate, date},
                    {SmsDynamicText.Vehical, vehical},
                    {SmsDynamicText.CentreNameAddress, centreNameAndAddress},

                };
                var customerMessge = _smsProviderHelper.GenerateSmsMessages(SmsType.BookingSuccess, messageText);

                _smsSender.SendSmsAsync(model.UserDetails.PhoneNo, customerMessge);
                if (!string.IsNullOrEmpty(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo))
                    _smsSender.SendSmsAsync(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo, customerMessge);
            }

            catch (Exception)
            {
                // ignored
            }

            finally
            {
                if (_smsProviderHelper.MessageProvider.SmsMessages.ServiceCentre.SendServiceCentreSms)
                    BookingConfirmationToServiceCentre(model);
            }

        }


        public static void BookingCancelled(OrderDetails model)
        {
            try
            {
                var values = new Dictionary<string, string>
                {
                    {SmsDynamicText.UserName, model.UserDetails.FirstName},
                    {SmsDynamicText.BookingId, model.InvoiceNo},
                };
                var messge = _smsProviderHelper.GenerateSmsMessages(SmsType.BookingCancelled, values);
                _smsSender.SendSmsAsync(model.UserDetails.PhoneNo, messge);
                if (!string.IsNullOrEmpty(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo))
                    _smsSender.SendSmsAsync(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo, messge);
            }
            catch (Exception)
            {
                // ignored
            }
            finally
            {
                if (_smsProviderHelper.MessageProvider.SmsMessages.ServiceCentre.SendServiceCentreSms)
                {
                    ServiceOrderCancel(model);
                }
            }
        }

        public static void BookingUpdate(OrderDetails order)
        {
            try
            {
                var values = new Dictionary<string, string>
                {
                    {SmsDynamicText.UserName, order.UserDetails.FirstName},
                    {SmsDynamicText.BookingId, order.InvoiceNo},
                    {SmsDynamicText.PickUpDate,order.SelectedAppointment.PickUpDate.Day +"-"+ order.SelectedAppointment.PickUpDate.Time },
                    {SmsDynamicText.DropOffDate,order.SelectedAppointment.DropOffDate.Day +"-"+ order.SelectedAppointment.DropOffDate.Time }
                };
                var messge = _smsProviderHelper.GenerateSmsMessages(SmsType.BookingUpdate, values);
                _smsSender.SendSmsAsync(order.UserDetails.PhoneNo, messge);
                if (!string.IsNullOrEmpty(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo))
                    _smsSender.SendSmsAsync(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo, messge);
            }
            catch (Exception)
            {
                // ignored
            }
            finally
            {
                if (_smsProviderHelper.MessageProvider.SmsMessages.ServiceCentre.SendServiceCentreSms)
                {
                    ServiceOrderUpdate(order);
                }
            }
        }

        public static void PickUpDone(string mobileNo, string name)
        {
            try
            {
                var values = new Dictionary<string, string>
                {
                    {SmsDynamicText.UserName, name},
                };
                var messge = _smsProviderHelper.GenerateSmsMessages(SmsType.PickUpDone, values);
                _smsSender.SendSmsAsync(mobileNo, messge);
            }
            catch (Exception)
            {
                // ignored
            }

        }

        public static void PickUpSuccess(string mobileNo, string name)
        {
            try
            {
                var values = new Dictionary<string, string>
                {
                    {SmsDynamicText.UserName, name},
                };
                var messge = _smsProviderHelper.GenerateSmsMessages(SmsType.PickUpSuccess, values);
                _smsSender.SendSmsAsync(mobileNo, messge);
            }
            catch (Exception)
            {
                // ignored
            }

        }
        public static void DropOffInitiated(string mobileNo, string name)
        {
            try
            {
                var values = new Dictionary<string, string>
                {
                    {SmsDynamicText.UserName, name},
                };
                var messge = _smsProviderHelper.GenerateSmsMessages(SmsType.DropOffInitiated, values);
                _smsSender.SendSmsAsync(mobileNo, messge);
            }
            catch (Exception)
            {
                // ignored
            }

        }
        public static void ServecingCompleted(string mobileNo, string name, string totalAmmount)
        {
            try
            {
                var values = new Dictionary<string, string>
                {
                    {SmsDynamicText.UserName, name},
                    {SmsDynamicText.TotalAmount, totalAmmount}
                };
                var messge = _smsProviderHelper.GenerateSmsMessages(SmsType.ServiceCompleted, values);
                _smsSender.SendSmsAsync(mobileNo, messge);
            }
            catch (Exception)
            {
                // ignored
            }

        }
        public static void PaymentDone(string mobileNo, string name, string totalAmmount)
        {
            try
            {
                var values = new Dictionary<string, string>
                {
                    {SmsDynamicText.UserName, name},
                    {SmsDynamicText.TotalAmount, totalAmmount}
                };
                var messge = _smsProviderHelper.GenerateSmsMessages(SmsType.PaymentDone, values);
                _smsSender.SendSmsAsync(mobileNo, messge);
            }
            catch (Exception)
            {
                // ignored
            }
        }
        public static void OfferSms(string mobileNo)
        {
            try
            {
                var messge = _smsProviderHelper.GenerateSmsMessages(SmsType.PaymentDone);
                _smsSender.SendSmsAsync(mobileNo, messge);
            }
            catch (Exception)
            {
                // ignored
            }

        }

        #endregion

        #region Service Centre
        public static void BookingConfirmationToServiceCentre(OrderDetails model)
        {
            try
            {
                Dictionary<string, string> messageText;
                GetMessageTextDictionary(model, out messageText);
                var centreMessage = _smsProviderHelper.GenerateSmsMessages(SmsType.ServicingConfirmation, messageText);
                _smsSender.SendSmsAsync(model.SelectedCentre.PhoneNo, centreMessage);
                if (!string.IsNullOrEmpty(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo))
                    _smsSender.SendSmsAsync(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo, centreMessage);
            }
            catch (Exception)
            {
                // ignored
            }

        }

        public static void ServiceOrderCancel(OrderDetails model)
        {
            try
            {
                Dictionary<string, string> messageText;
                GetMessageTextDictionary(model, out messageText);
                var centreMessage = _smsProviderHelper.GenerateSmsMessages(SmsType.ServiceOrderCancel, messageText);
                _smsSender.SendSmsAsync(model.SelectedCentre.PhoneNo, centreMessage);
                if (!string.IsNullOrEmpty(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo))
                    _smsSender.SendSmsAsync(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo, centreMessage);
            }
            catch (Exception)
            {

                // throw;
            }


        }

        public static void ServiceOrderUpdate(OrderDetails order)
        {
            try
            {
                Dictionary<string, string> messageText = new Dictionary<string, string>{
                    { SmsDynamicText.UserName, order.UserDetails.FirstName },
                    { SmsDynamicText.Status, order.Status } };
                var centreMessage = _smsProviderHelper.GenerateSmsMessages(SmsType.BookingStatusUpdate, messageText);
                _smsSender.SendSmsAsync(order.SelectedCentre.PhoneNo, centreMessage);
                if (!string.IsNullOrEmpty(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo))
                    _smsSender.SendSmsAsync(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo, centreMessage);
            }
            catch (Exception)
            {

                // throw;
            }
        }

        public static void QuotationUpdates(OrderDetails order)
        {
            try
            {
                var serviceList = order.SelectedServices.Select(x => x.Name).ToArray();
                var serviceName = string.Join(",", serviceList);
                Dictionary<string, string> messageText = new Dictionary<string, string>{
                    { SmsDynamicText.UserName, order.UserDetails.FirstName },
                    {SmsDynamicText.TotalAmount, order.SelectedCentre.TotalMMPrice.ToString()},
                    {SmsDynamicText.BookingId, order.InvoiceNo},
                    {SmsDynamicText.Make, order.SelectedCar.Year},
                    {SmsDynamicText.Vehical, order.SelectedCar.Model},
                    {SmsDynamicText.ServiceName, serviceName} };
                var type = order.QuotationRevision.Status == "Accepted" ? SmsType.QuotationAccepted : SmsType.QuotationRejected;
                var centreMessage = _smsProviderHelper.GenerateSmsMessages(type, messageText);
                _smsSender.SendSmsAsync(order.UserDetails.PhoneNo, centreMessage);
                if (!string.IsNullOrEmpty(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo))
                    _smsSender.SendSmsAsync(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo, centreMessage);
            }
            catch (Exception)
            {

                // throw;
            }
        }

        public static void OrderStatusUpdate(OrderDetails order)
        {
            try
            {
                Dictionary<string, string> messageText;
                GetMessageTextDictionary(order, out messageText);
                var centreMessage = _smsProviderHelper.GenerateSmsMessages(SmsType.ServiceOrderUpdate, messageText);
                _smsSender.SendSmsAsync(order.SelectedCentre.PhoneNo, centreMessage);
                if (!string.IsNullOrEmpty(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo))
                    _smsSender.SendSmsAsync(_smsProviderHelper.MessageProvider.SmsMessages.MilematesNo, centreMessage);
            }
            catch (Exception)
            {

                // throw;
            }
        }
        #endregion



        #region Common 

        private static void GetMessageTextDictionary(OrderDetails model, out Dictionary<string, string> messageText)
        {
            var serviceList = model.SelectedServices.Select(x => x.Name).ToArray();
            var serviceName = string.Join(",", serviceList);
            var userNameAndAddress = string.Format(model.UserDetails.FirstName + ", " + model.UserDetails.AddressLine1 +
                                       model.UserDetails.AddressLine2 + " "
                                       + model.UserDetails.PhoneNo);
            var pickUpdate = string.Format(model.SelectedAppointment.PickUpDate.Day + "(" + model.SelectedAppointment.PickUpDate.Time + ")");
            var dropOffdate = string.Format(model.SelectedAppointment.DropOffDate.Day + "(" + model.SelectedAppointment.DropOffDate.Time + ")");
            var vehical = model.SelectedCar.Brand + "-" + model.SelectedCar.Model + "-" + model.SelectedCar.Year + "-" + model.SelectedCar.Varient;
            messageText = new Dictionary<string, string>
                {
                    {SmsDynamicText.BookingId, model.InvoiceNo},
                    {SmsDynamicText.ServiceName, serviceName},
                    {SmsDynamicText.PickUpDate, pickUpdate},
                    {SmsDynamicText.Vehical, vehical},
                    {SmsDynamicText.PickUpAddress, userNameAndAddress},
                    {SmsDynamicText.DropOffDate, dropOffdate},
                    {SmsDynamicText.PaymentMode, model.PaymentMode},
                    {SmsDynamicText.TotalAmount, model.SelectedCentre.TotalMMPrice.ToString()}

                };
        }
        #endregion


    }
}
