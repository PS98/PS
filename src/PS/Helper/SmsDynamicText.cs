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
                {"{paymentMod}", PaymentMode}
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

    }
 
}
