using Microsoft.Extensions.OptionsModel;
using RestSharp;
using RestSharp.Authenticators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
//using System.Net.Mail;
//using System.Net;

namespace PS.Services
{
    public class AuthMessageSender : IEmailSender, ISmsSender
    {
        public AuthMessageSender(IOptions<AuthMessageSenderOptions> optionsAccessor)
        {
            Options = optionsAccessor.Value;
        }

        public AuthMessageSenderOptions Options { get; }  // set only via Secret Manager

        //public Task SendSimpleMessage(string email, string subject, string message)
        //{
            // Plug in your email service here to send an email.
            //var myMessage = new SendGrid.SendGridMessage();
            //myMessage.AddTo(email);
            //myMessage.From = new MailAddress("varshney@shobhit.com", "Shobhit", System.Text.Encoding.Default);
            //myMessage.Subject = subject;
            //myMessage.Text = message;
            //myMessage.Html = message;
            //var credentials = new NetworkCredential(
            //    Options.SendGridUser,
            //    Options.SendGridKey);
            //// Create a Web transport for sending email.
            //var transportWeb = new SendGrid.Web(credentials);
            // Send the email.
            //if (transportWeb != null)
            //{
            //    return transportWeb.DeliverAsync(myMessage);
            //}
            //else
            //{
               // return Task.FromResult(0);
            //}
       // }

        public Task SendSmsAsync(string number, string message)
        {
            // Plug in your SMS service here to send a text message.
            var twilio = new Twilio.TwilioRestClient(
           Options.MessageSid,           // Account Sid from dashboard
           Options.MessageAuthToken);    // Auth Token
                                                   // "i7qydlUseytO4VqWT0ip0tqkoCGKa1rh" secret id
                                                   // SK1222a7d0b0f58495a6c76531997e7fb6 sid
                                                   //Shobhit98 friendly name
            var result = twilio.SendMessage("+13343283001", "+918380911266", message);
            System.Diagnostics.Debug.WriteLine(result);
            return Task.FromResult(0);
        }

        //public async Task SendSimpleMessage(string email, string subject, string message)
        //{
           // var smtp = new SmtpClient("smtp.live.com", 465);

           // var creds = new NetworkCredential("varshneyshobhit98@hotmail.com", "Shob@9897598165");

            //smtp.UseDefaultCredentials = false;
            //smtp.Credentials = creds;
            //smtp.EnableSsl = true;

            //var to = new MailAddress(email);
           // var from = new MailAddress("info@ycc.com", "Your Contractor Connection");

           // var msg = new MailMessage();

            //msg.To.Add(to);
            //msg.From = from;
            //msg.IsBodyHtml = true;
            //msg.Subject = subject;
            //msg.Body = message;

           // await smtp.SendMailAsync(msg);
       // }

        public RestResponse SendSimpleMessage(string email, string subject, string message)
        {
            RestClient client = new RestClient();

            client.BaseUrl = new Uri(Options.EmailBaseUri, UriKind.Absolute);
            client.Authenticator = new HttpBasicAuthenticator(
                "api", Options.EmailApiKey);
            RestRequest request = new RestRequest();
            request.AddParameter("domain", Options.EmailDomain, ParameterType.UrlSegment);
            request.Resource = "{domain}/messages";
            request.AddParameter("from", Options.EmailFrom);
            request.AddParameter("to", email);
            request.AddParameter("subject", subject);
            request.AddParameter("text", message);
            request.Method = Method.POST;
            var a = (RestResponse)client.Execute(request);
            return a;
        }
    }
}
