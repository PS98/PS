using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.OptionsModel;
using PS.Models;
using PS.Services;

namespace PS.Helper.Email
{
    public class EmailSender
    {
        private readonly IEmailSender _emailSender;
        private readonly EmailBodyProvider _emailBody;
        public EmailSender(IEmailSender sender, EmailBodyProvider emailBodyProvider)
        {
            _emailSender = sender;
            _emailBody = emailBodyProvider;
        }
        private Dictionary<string, string> GetDynamicTextValue(OrderDetails orderDetails)
        {
            var values = new Dictionary<string, string>
                {
                    {SmsDynamicText.BookingId, orderDetails.InvoiceNo},
                    {SmsDynamicText.UserPhoneNo, orderDetails.UserDetails.PhoneNo},
                    {
                        SmsDynamicText.Vehical,
                        orderDetails.SelectedCar.Brand + "-" + orderDetails.SelectedCar.Model + "-" +
                        orderDetails.SelectedCar.Varient + "-" + orderDetails.SelectedCar.Year
                    },
                    {
                        SmsDynamicText.PickUpTime,
                        orderDetails.SelectedAppointment.PickUpDate.Day + "   -   " +
                        orderDetails.SelectedAppointment.PickUpDate.Time
                    },
                    {
                        SmsDynamicText.DropOffTime,
                        orderDetails.SelectedAppointment.DropOffDate.Day + "   -   " +
                        orderDetails.SelectedAppointment.DropOffDate.Time
                    },
                    {
                        SmsDynamicText.UserName,
                        orderDetails.UserDetails.FirstName + " " + orderDetails.UserDetails.LastName
                    },
                    {SmsDynamicText.ServiceCentreName, orderDetails.SelectedCentre.Name},
                    {SmsDynamicText.CentreArea, orderDetails.SelectedCentre.Address.Line2},
                    {
                        SmsDynamicText.PickUpAddress,
                        orderDetails.UserDetails.AddressLine1 + "<br/>" + orderDetails.UserDetails.AddressLine2
                    },
                     {SmsDynamicText.CentrePhoneNo, orderDetails.SelectedCentre.PhoneNo},
                    {SmsDynamicText.ServiceName, GetSelectedservice(orderDetails)},
                    {SmsDynamicText.TotalAmount, orderDetails.SelectedCentre.TotalMMPrice.ToString()},
                    {SmsDynamicText.PaymentMode, orderDetails.PaymentMode},
                };
            return values;

        }
        private string GetSelectedservice(OrderDetails services)
        {
            string container;
            if (services.SelectedCentre.ServiceDetails.Count > 1)
            {
                container = services.SelectedCentre.ServiceDetails.Aggregate("<div><span style='margin-right:5em'>",
                    (current, service) =>
                        current + (service.Name + "</span><span>" + service.MilematePrice + "</span><br>"));
                container += "</div>";
                container += "<div><span style='margin-right:5em'> Total Price</span> <span>" +
                             services.SelectedCentre.ServiceDetails.Sum(x => x.MilematePrice) + "</span></div>";
            }
            else
            {
                container = services.SelectedServices[0].Name;
            }
            foreach (var selectedService in services.SelectedServices)
            {
                if (!string.IsNullOrEmpty(selectedService.Request))
                {
                    container += "<div><span style='margin-right:5em'> Your Request :</span> <span>" + selectedService.Request + "</span></div>";

                }
                if (!string.IsNullOrEmpty(selectedService.Notes))
                {
                    container += "<div><span style='margin-right:5em'> Notes for mechanic :</span> <span>" + selectedService.Notes + "</span></div>";
                }

            }
            return container;
        }

        public void SendEmail(string email, string subject, string message)
        {
            try
            {
                _emailSender.SendSimpleMessage(email, subject, message);
            }
            catch (Exception ex)
            {

            }
        }
        public void RegistrationSuccess(string email, string name)
        {
            try
            {
                var values = new Dictionary<string, string> { { SmsDynamicText.UserName, name } };
                var message = _emailBody.GenerateEmailBody(SmsType.RegistrationCompleted, values);
                _emailSender.SendSimpleMessage(email, "Registration Completed", message);
                _emailSender.SendSimpleMessage("jitinjec@gmail.com", "Registration Completed", message);
            }
            catch (Exception ex)
            {

            }
        }
        public void FirstOrder(string email, string name)
        {
            try
            {
                var values = new Dictionary<string, string> { { SmsDynamicText.UserName, name } };
                var message = _emailBody.GenerateEmailBody(SmsType.FirstOrder, values);
                _emailSender.SendSimpleMessage(email, "Booked First Order With Milmates", message);
            }
            catch (Exception ex)
            {

            }
        }

        public void BookingSuccess(OrderDetails orderDetails)
        {
            try
            {
                var values = GetDynamicTextValue(orderDetails);
                var message = _emailBody.GenerateEmailBody(SmsType.BookingSuccess, values);
                var subject = "Booking Confirmatiom : " + orderDetails.InvoiceNo +
                              " with Milemates.com has been placed";
                _emailSender.SendSimpleMessage(orderDetails.UserDetails.Email, subject, message);
                _emailSender.SendSimpleMessage("jitinjec@gmail.com", subject, message);

            }
            catch (Exception ex)
            {
            }
            finally
            {
                BookingConfirmed(orderDetails);
            }
        }

        public void BookingConfirmed(OrderDetails orderDetails)
        {
            try
            {
                var values = GetDynamicTextValue(orderDetails);
                var message = _emailBody.GenerateEmailBody(SmsType.BookingConfirmed, values);
                _emailSender.SendSimpleMessage(orderDetails.SelectedCentre.Email, "Booking Confirmed From Milemates", message);
                _emailSender.SendSimpleMessage("jitinjec@gmail.com", "Booking Confirmed From Milemates", message);
            }
            catch (Exception ex)
            {

            }
        }
        public void BookingCancelled(OrderDetails orderDetails)
        {
            try
            {
                var values = GetDynamicTextValue(orderDetails);
                var message = _emailBody.GenerateEmailBody(SmsType.BookingCancelled, values);
                _emailSender.SendSimpleMessage(orderDetails.UserDetails.Email, "Your booking -"+ orderDetails.InvoiceNo +" has been cancelled", message);
                _emailSender.SendSimpleMessage("jitinjec@gmail.com", "Your booking -" + orderDetails.InvoiceNo + " has been cancelled", message);
            }
            catch (Exception ex)
            {

            }
        }

    }
}
