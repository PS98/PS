using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PS.Models;
using PS.Services;

namespace PS.Helper
{
    public class SmsSender
    {
        private static ISmsSender _smsSender;
        private static SmsProviderHelper _smsProviderHelper;
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
            catch (Exception ex)
            {

            }
        }

        public static void RegistrationSuccessfull(string mobileNo, string name)
        {
            try
            {
                var values = new Dictionary<string, string> { { SmsDynamicText.UserName, name } };
                var messge = _smsProviderHelper.GenerateSmsMessages(SmsType.RegistrationCompleted, values);
                _smsSender.SendSmsAsync(mobileNo, messge);
            }
            catch (Exception ex)
            {

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
            }

            catch (Exception ex)
            {

            }

            finally
            {
                BookingConfirmationToServiceCentre(model);
            }

        }

        public static void BookingConfirmationToServiceCentre(OrderDetails model)
        {
            try
            {
                var serviceList = model.SelectedServices.Select(x => x.Name).ToArray();
                var serviceName = string.Join(",", serviceList);
                var userNameAndAddress = string.Format(model.UserDetails.FirstName + ", " + model.UserDetails.AddressLine1 +
                                           model.UserDetails.AddressLine2 + " "
                                           + model.UserDetails.PhoneNo);
                var pickUpdate = string.Format(model.SelectedAppointment.PickUpDate.Day + "(" + model.SelectedAppointment.PickUpDate.Time + ")");
                var dropOffdate = string.Format(model.SelectedAppointment.DropOffDate.Day + "(" + model.SelectedAppointment.DropOffDate.Time + ")");
                var vehical = model.SelectedCar.Model + model.SelectedCar.Model;
                var messageText = new Dictionary<string, string>
                {
                    {SmsDynamicText.BookingId, model.InvoiceNo},
                    {SmsDynamicText.ServiceName, serviceName},
                    {SmsDynamicText.PickUpDate, pickUpdate},
                    {SmsDynamicText.Vehical, vehical},
                    {SmsDynamicText.PickUpAddress, userNameAndAddress},
                    {SmsDynamicText.DropOffDate, dropOffdate},
                    {SmsDynamicText.PaymentMode, model.PaymentMode}

                };
                var centreMessage = _smsProviderHelper.GenerateSmsMessages(SmsType.ServicingConfirmation, messageText);
                _smsSender.SendSmsAsync(model.SelectedCentre.PhoneNo, centreMessage);
            }
            catch (Exception ex)
            {

            }

        }
        public static void BookingCancelled(string mobileNo, string name, string bookingId)
        {
            try
            {
                var values = new Dictionary<string, string>
                {
                    {SmsDynamicText.UserName, name},
                    {SmsDynamicText.BookingId, bookingId},
                };
                var messge = _smsProviderHelper.GenerateSmsMessages(SmsType.BookingCancelled, values);
                _smsSender.SendSmsAsync(mobileNo, messge);
            }
            catch (Exception ex)
            {

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
            catch (Exception ex)
            {

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
            catch (Exception ex)
            {

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
            catch (Exception ex)
            {

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
            catch (Exception ex)
            {

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
            catch (Exception ex)
            {

            }

        }
        public static void OfferSms(string mobileNo)
        {
            try
            {
                var messge = _smsProviderHelper.GenerateSmsMessages(SmsType.PaymentDone);
                _smsSender.SendSmsAsync(mobileNo, messge);
            }
            catch (Exception ex)
            {

            }

        }
    }
}
