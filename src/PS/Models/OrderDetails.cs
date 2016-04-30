using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Models
{
    public class OrderDetails
    {
        public static int orderCount = 0;
        public MongoDB.Bson.ObjectId _id { get; set; }
        public string PaymentMode { get; set; }
        public Centre selectedCentre { get; set; }
        private string _invoiceNo;
        public string InvoiceNo {

            get { 
                return _invoiceNo;
            }

            set
            {

                orderCount++;
                var date = DateTime.Now;
                _invoiceNo = orderCount.ToString() + date.ToString("MM") + date.ToString("dd");
            }
        }
      //  public List<PS.Models.Services> selectedServices { get; set; }
        public CarDetails selectedCar { get; set; }
        public Appointment selectedAppointment { get; set; }
        public User userDetails { get; set; }
    }

    public class CarDetails
    {
        public string Brand { get; set; }
        public string Model { get; set; }
        public string year { get; set; }
        public string Varient { get; set; }
    }

    public class Appointment
    {
        public AppointmentDetails dropOffDate { get; set; }
        public AppointmentDetails pickUpDate { get; set; }
    }

    public class AppointmentDetails
    {
        public string day { get; set; }
        public string time { get; set; }
    }

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
