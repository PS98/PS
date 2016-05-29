using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PS.Services;

namespace PS.Helper
{
    public  static class SmsSender
    {
       
        public static  void SendOtpSms(string mobileNo,string otp, ISmsSender smsSender, SmsProviderHelper messageProvider)
        {
            var values = new Dictionary<string, string>();
            values.Add(SmsDynamicText.Otp, otp);
            var messge = messageProvider.GenerateSmsMessages("RegOtp", values);
            smsSender.SendSmsAsync(mobileNo, messge);
        }
    }
}
