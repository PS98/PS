using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using PS.Services;
using MongoDB.Driver;

namespace PS.Models
{
    [BsonIgnoreExtraElements]
    public class OrderDetails
    {

        [JsonIgnore]
        public ObjectId Id { get; set; }
        public string PaymentMode { get; set; }
        public string PaymentId { get; set; }
        public string PaymentRequestId { get; set; }
        public PaymentValidateResponseModel PaymentResponse { get; set; }
        public ServiceCentreViewModel SelectedCentre { get; set; }
        private string _invoiceNo;

        public string InvoiceNo
        {
            get { return _invoiceNo; }
            set
            {
                var date = DateTime.Now;
                _invoiceNo = !string.IsNullOrEmpty(value)
                    ? value
                    : "MM" + MongoRepository.RandomNumber(5) + date.ToString("MM") + date.ToString("dd");
            }
        }
        public QuotationRevision QuotationRevision { get; set; }

        public List<Service> SelectedServices { get; set; }
        public CarDetails SelectedCar { get; set; }
        public Appointment SelectedAppointment { get; set; }
        public User UserDetails { get; set; }
        public string Status { get; set; }
        public DateTime BookingDate { get; set; }
        public DateTime CancellationDate { get; set; }

        public bool Changed(OrderDetails other)
        {
            if (other == null)
                return false;

            return (SelectedAppointment.DropOffDate != other.SelectedAppointment.DropOffDate ||
                SelectedAppointment.PickUpDate != other.SelectedAppointment.PickUpDate ||
                SelectedCentre.PhoneNo != other.SelectedCentre.PhoneNo ||
                SelectedCentre.TotalActualPrice != other.SelectedCentre.TotalActualPrice ||
                SelectedCentre.Address != other.SelectedCentre.Address ||
                SelectedCar.Brand != other.SelectedCar.Brand ||
                SelectedCar.Model != other.SelectedCar.Model ||
                SelectedCar.Year != other.SelectedCar.Year ||
                SelectedCar.Varient != other.SelectedCar.Varient ||
                UserDetails.FirstName != other.UserDetails.FirstName ||
                UserDetails.AddressLine1 != other.UserDetails.AddressLine1 ||
                UserDetails.AddressLine2 != other.UserDetails.AddressLine2);
        }

        public void GetPriceForSelectedService()
        {
            var queryForPriceDetails = new BsonDocument
            {
                {"CentreId", SelectedCentre.Id }
            };
            var _repo = new MongoRepository("serviceCentre");
            var collection = _repo.GetCollection<ServiceCentre>("Pune");
            var centreDetails = collection?.Find(queryForPriceDetails).SingleOrDefaultAsync().Result;
            var serviceDetails = centreDetails.ServiceDetails;
            foreach (var services in serviceDetails)
            {
                foreach (var selectedService in SelectedCentre.ServiceDetails)
                {
                    if (services.Name == selectedService.Name)
                    {
                        if (SelectedCar.Varient == "Diesel")
                        {
                            var model = services.Diesel.Find(r => r.ModelList.Contains(SelectedCar.Model));
                            selectedService.ActualPrice = model.ActualPrice;
                            selectedService.MilematePrice = model.MilematePrice;
                        }
                        if (SelectedCar.Varient == "Petrol")
                        {
                            var model = services.Diesel.Find(r => r.ModelList.Contains(SelectedCar.Model));
                            selectedService.ActualPrice = model.ActualPrice;
                            selectedService.MilematePrice = model.MilematePrice;
                        }
                        if (SelectedCar.Varient == "CNG")
                        {
                            var model = services.Diesel.Find(r => r.ModelList.Contains(SelectedCar.Model));
                            selectedService.ActualPrice = model.ActualPrice;
                            selectedService.MilematePrice = model.MilematePrice;
                        }
                        if (SelectedCar.Varient == "Electric")
                        {
                            var model = services.Diesel.Find(r => r.ModelList.Contains(SelectedCar.Model));
                            selectedService.ActualPrice = model.ActualPrice;
                            selectedService.MilematePrice = model.MilematePrice;
                        }
                    }
                }
            }
        }
    }

    //public class UserServices
    //{
    //    public List<Service> service { get; set; }
    //}
    [BsonIgnoreExtraElements]
    public class Service
    {
        public string Name { get; set; }
        public List<Questions> Questions { get; set; }
        [BsonIgnoreIfNull]
        public string Request { get; set; }
        [BsonIgnoreIfNull]
        public string Notes { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class CarDetails
    {
        public string Brand { get; set; }
        public string Model { get; set; }
        public string Year { get; set; }
        public string Varient { get; set; }
    }
    [BsonIgnoreExtraElements]
    public class Appointment
    {
        public AppointmentDetails DropOffDate { get; set; }
        public AppointmentDetails PickUpDate { get; set; }
        public PickUpDetails PickUpDetails { get; set; }
    }
    [BsonIgnoreExtraElements]
    public class AppointmentDetails
    {
        public string Day { get; set; }
        public string Time { get; set; }
    }
    [BsonIgnoreExtraElements]
    public class PickUpDetails
    {
        public bool IsPickUp { get; set; }
        public string Type { get; set; }
    }
    [BsonIgnoreExtraElements]
    public class User
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNo { get; set; }
        public string FormattedAddress { get; set; }
        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Country { get; set; }

        public string ZipCode { get; set; }

    }

    [BsonIgnoreExtraElements]
    public class QuotationRevision
    {
        public List<Detalis> ServiceDetails { get; set; }
        public string Status { get; set; }
    }
}
