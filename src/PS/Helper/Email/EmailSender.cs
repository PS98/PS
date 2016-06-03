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
                var values = new Dictionary<string, string>
                {
                    {SmsDynamicText.UserName, orderDetails.UserDetails.FirstName +" "+ orderDetails.UserDetails.LastName},
                    {SmsDynamicText.ServiceCentreName, orderDetails.SelectedCentre.Name},
                    {SmsDynamicText.CentreArea, orderDetails.SelectedCentre.Address.Line2},
                    {SmsDynamicText.PickUpAddress,orderDetails.UserDetails.AddressLine1 +"<br/>"+ orderDetails.UserDetails.AddressLine2},
                    {SmsDynamicText.ServiceName, GetSelectedservice(orderDetails)},
                    {SmsDynamicText.TotalAmount, orderDetails.SelectedCentre.TotalMMPrice.ToString()},
                    {SmsDynamicText.PaymentMode, orderDetails.PaymentMode},
                };
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

        private string GetSelectedservice(OrderDetails services)
        {
            var container = services.SelectedCentre.ServiceDetails.Aggregate("<div><span style='margin-right:5em'>", (current, service) => current + (service.Name + "</span><span>" + service.MilematePrice + "</span><br>"));
            container += "</div>";
            container += "<div><span style='margin-right:5em'> Total Price</span> <span>" + services.SelectedCentre.ServiceDetails.Sum(x => x.MilematePrice) + "</span></div>";
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
        public void BookingConfirmed(OrderDetails orderDetails)
        {
            try
            {
                var values = new Dictionary<string, string>
                {
                      { SmsDynamicText.BookingId, orderDetails.InvoiceNo },
                    { SmsDynamicText.UserName, orderDetails.UserDetails.FirstName +" " + orderDetails.UserDetails.LastName },
                        { SmsDynamicText.UserPhoneNo, orderDetails.UserDetails.PhoneNo },
                    { SmsDynamicText.Vehical, orderDetails.SelectedCar.Brand + "-"+ orderDetails.SelectedCar.Model+ "-"+ orderDetails.SelectedCar.Varient + "("+orderDetails.SelectedCar.Year +")"  },
                    { SmsDynamicText.ServiceCentreName, orderDetails.SelectedCentre.Name },
                      { SmsDynamicText.ServiceName, GetSelectedservice(orderDetails) },
                    { SmsDynamicText.PickUpTime, orderDetails.SelectedAppointment.PickUpDate.Day + ": " + orderDetails.SelectedAppointment.PickUpDate.Time},
                    { SmsDynamicText.PickUpAddress, orderDetails.UserDetails.AddressLine1 + orderDetails.UserDetails.AddressLine2},
                    { SmsDynamicText.DropOffTime,  orderDetails.SelectedAppointment.DropOffDate.Day + ": " + orderDetails.SelectedAppointment.DropOffDate.Time},
                    { SmsDynamicText.PaymentMode, orderDetails.PaymentMode },
                };
                var message = _emailBody.GenerateEmailBody(SmsType.BookingConfirmed, values);
                _emailSender.SendSimpleMessage(orderDetails.SelectedCentre.Email, "Booking Confirmed From Milemates", message);
                _emailSender.SendSimpleMessage("jitinjec@gmail.com", "Booking Confirmed From Milemates", message);
            }
            catch (Exception ex)
            {

            }
        }
    }
}
