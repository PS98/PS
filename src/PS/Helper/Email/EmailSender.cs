using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.OptionsModel;
using PS.Services;

namespace PS.Helper.Email
{
    public class EmailSender
    {
        private static IEmailSender _emailSender;
        private static EmailBodyProvider _emailBody;
        public EmailSender(IEmailSender sender, EmailBodyProvider emailBodyProvider)
        {
            _emailSender = sender;
            _emailBody = emailBodyProvider;
        }

        public static void RegistrationSuccess(string email, string name)
        {
            try
            {
                var values = new Dictionary<string, string> { { SmsDynamicText.UserName, name } };
                var messge = _emailBody.GenerateEmailBody(SmsType.RegistrationCompleted, values);
                _emailSender.SendSimpleMessage(email,"Registration Completed", messge);
            }
            catch (Exception ex)
            {

            }
        }
    }
}
