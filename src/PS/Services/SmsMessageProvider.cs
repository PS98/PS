using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Services
{
    public class SmsMessageProvider
    {
      public SmsMessages SmsMessages { get; set; }
    }

    public class SmsMessages
    {
        public User User { get; set; }
        public Servicecentre ServiceCentre { get; set; }
    }
    public class User
    {
        public string BookingCancelled { get; set; }
        public string BookingSuccess { get; set; }
        public string DropOffInitiated { get; set; }
        public string PaymentDone { get; set; }
        public string PickUpDone { get; set; }
        public string PickUpSuccess { get; set; }
        public string RegistrationCompleted { get; set; }
        public string RegistrationOtp { get; set; }
        public string ServiceCompleted { get; set; }
        public string Offer { get; set; }
        public string BookingRemainder { get; set; }
        public string DropOffDone { get; set; }
        public string QuotationAccepted { get; set; }
        public string QuotationRejected { get; set; }
        public string ExtraAmount { get; set; }
    }

    public class Servicecentre
    {
        public string ServicingConfirmation { get; set; }
        public string ServicingQuotationAccepted { get; set; }
        public string ServiceCodPayment { get; set; }
        public string ServicingQuotationRejected { get; set; }
        public string ServiceOnlinePayment { get; set; }
        public string ServicePickRemainder { get; set; }
        public string ServiceDropRemainder { get; set; }
        public string ServiceOrderUpdate { get; set; }
        public string ServiceOrderCancel { get; set; }
        public bool SendServiceCentreSms { get; set; }


    }
}
