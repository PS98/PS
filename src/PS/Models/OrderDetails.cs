using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using PS.Services;

namespace PS.Models
{
    [BsonIgnoreExtraElements]
    public class OrderDetails
    {
        public static int OrderCount = 0;

        public OrderDetails()
        {
            OrderCount++;
            var date = DateTime.Now;
            InvoiceNo = "MM" + MongoRepository.RandomNumber(5) + date.ToString("MM") + date.ToString("dd");
        }
        [JsonIgnore]
        public MongoDB.Bson.ObjectId Id { get; set; }
        public string PaymentMode { get; set; }
        [JsonIgnore]
        public string PaymentId { get; set; }
        [JsonIgnore]
        public string PaymentRequestId { get; set; }
        [JsonIgnore]
        public PaymentValidateResponseModel PaymentResponse { get; set; }
        public ServiceCentreViewModel SelectedCentre { get; set; }
        public string InvoiceNo { get; set; }
        public List<Service> SelectedServices { get; set; }
        public CarDetails SelectedCar { get; set; }
        public Appointment SelectedAppointment { get; set; }
        public User UserDetails { get; set; }
        public string Status { get; set; }
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
}
