using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace PS.Helper
{
    public class SmsDynamicText
    {
        public SmsDynamicText()
        {
            SmsText = new Dictionary<string, string>
            {
                {"{Otp}", Otp},
                {"{totalAmount}", TotalAmount},
                {"{user}", UserName},
                {"{bookingId}", BookingId},
                {"{pickDate}", PickUpDate},
                {"{vehical}", Vehical},
                {"{service}", ServiceName},
                {"{centre}", CentreNameAddress},
                {"{pickAdd}", PickUpAddress},
                {"{pickTime}", PickUpTime},
                {"{dropTime}", DropOffTime},
                {"{userPhoneNo}",UserPhoneNo },
                 {"{email}", Email},
                {"{paymentMod}", PaymentMode},
                 {"{password}", Password},
                {"{verificationLink}",VerificationLink },
                {"{serviceCentreName}",ServiceCentreName },
                {"{centreArea}",CentreArea },
                 {"{centrePhoneNo}",CentrePhoneNo },
            };
        }

        public Dictionary<string, string> SmsText { get; set; }

        public static readonly string Otp = "Otp";
        public static readonly string UserName = "UserName";
        public static readonly string TotalAmount = "TotalAmount";
        public static readonly string BookingId = "BookingId";
        public static readonly string PickUpDate = "PickUpDate";
        public static readonly string DropOffDate = "DropOffDate";
        public static readonly string Vehical = "Vehical";
        public static readonly string ServiceName = "ServiceName";
        public static readonly string CentreNameAddress = "CentreNameAddress";
        public static readonly string PickUpAddress = "PickUpAddress";
        public static readonly string PickUpTime = "PickUpTime";
        public static readonly string DropOffTime = "DropOffTime";
        public static readonly string PaymentMode = "PaymentMode";
        public static readonly string Email = "Email";
        public static readonly string Password = "Password";
        public static readonly string VerificationLink = "VerificationLink";
        public static readonly string ServiceCentreName = "ServiceCentreName";
        public static readonly string CentreArea = "CentreArea";
        public static readonly string UserPhoneNo = "UserPhoneNo";
        public static readonly string CentrePhoneNo = "CentrePhoneNo";
        // public static readonly string CentreArea = "CentreArea";


    }

    public static class SmsType
    {
        public const string RegistrationOtp = "RegistrationOtp";
        public const string RegistrationCompleted = "RegistrationCompleted";
        public const string BookingCancelled = "BookingCancelled";

        public const string BookingSuccess = "BookingSuccess";
        public const string DropOffInitiated = "DropOffInitiated";
        public const string PaymentDone = "PaymentDone";
        public const string PickUpDone = "PickUpDone";
        public const string PickUpSuccess = "PickUpSuccess";
        public const string ServiceCompleted = "ServiceCompleted";
        public const string Offer = "Offer";

        public const string ServicingConfirmation = "ServicingConfirmation";

        public const string FirstOrder = "FirstOrder";
        public const string BookingConfirmed = "BookingConfirmed";
    }

}
