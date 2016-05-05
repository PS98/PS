using Microsoft.Extensions.OptionsModel;
using RestSharp;
using RestSharp.Authenticators;
using RestSharp.Extensions.MonoHttp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
//using System.Net.Mail;
//using System.Net;

namespace PS.Services
{
    public class AuthMessageSender : IEmailSender, ISmsSender, IPaymentProcessor
    {
        public AuthMessageSender(IOptions<AuthMessageSenderOptions> optionsAccessor)
        {
            Options = optionsAccessor.Value;
        }

        public AuthMessageSenderOptions Options { get; }  // set only via Secret Manager

        public bool SendSmsAsync(string number, string message)
        {
            //Your authentication key
            string authKey = Options.MessageSid;
            //Multiple mobiles numbers separated by comma
            string mobileNumber = number;
            //Sender ID,While using route4 sender id should be 6 characters long.
            string senderId = "102234";
            //Your message to send, Add URL encoding here.
            string msg = HttpUtility.UrlEncode(message);

            //Prepare you post parameters
            StringBuilder sbPostData = new StringBuilder();
            sbPostData.AppendFormat("authkey={0}", authKey);
            sbPostData.AppendFormat("&mobiles={0}", mobileNumber);
            sbPostData.AppendFormat("&message={0}", msg);
            sbPostData.AppendFormat("&sender={0}", senderId);
            sbPostData.AppendFormat("&route={0}", "default");

            try
            {
                //Call Send SMS API
                string sendSMSUri = Options.MessageBaseUri;
                //Create HTTPWebrequest
                HttpWebRequest httpWReq = (HttpWebRequest)WebRequest.Create(sendSMSUri);
                //Prepare and Add URL Encoded data
                UTF8Encoding encoding = new UTF8Encoding();
                byte[] data = encoding.GetBytes(sbPostData.ToString());
                //Specify post method
                httpWReq.Method = "POST";
                httpWReq.ContentType = "application/x-www-form-urlencoded";
                httpWReq.ContentLength = data.Length;
                using (Stream stream = httpWReq.GetRequestStream())
                {
                    stream.Write(data, 0, data.Length);
                }
                //Get the response

                //TODO: Uncomment below lines for sending the message

                //HttpWebResponse response = (HttpWebResponse)httpWReq.GetResponse();
                //StreamReader reader = new StreamReader(response.GetResponseStream());
                //string responseString = reader.ReadToEnd();

                //Close the response
                //reader.Close();
                //response.Close();
                return true;
            }
            catch (SystemException ex)
            {
                System.Diagnostics.Debug.WriteLine(ex.Message.ToString());
                return false;
            }

        }

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

        public RestResponse ValidateOrder(string pId, string pReqId)
        {
            RestClient client = new RestClient();

            client.BaseUrl = new Uri(Options.payment.BaseUrl + pReqId + "/" + pId, UriKind.Absolute);
            RestRequest request = new RestRequest();
            request.AddHeader("X-Api-Key", Options.payment.XApiKey);
            request.AddHeader("X-Auth-Token", Options.payment.XAuthToken);
            request.Method = Method.POST;
            var a = (RestResponse)client.Execute(request);
            return a;
        }

        public RestResponse OrderPayment(string name, string purpose, int amount, string email, string phone, bool send_email, bool send_sms)
        {
            RestClient client = new RestClient();

            client.BaseUrl = new Uri(Options.payment.BaseUrl, UriKind.Absolute);
            RestRequest request = new RestRequest();
            request.AddHeader("X-Api-Key", Options.payment.XApiKey);
            request.AddHeader("X-Auth-Token", Options.payment.XAuthToken);
            request.AddParameter("buyer_name", name);
            request.AddParameter("purpose", purpose);
            request.AddParameter("amount", amount);
            if (!string.IsNullOrEmpty(email))
            request.AddParameter("email", email);
            if (!string.IsNullOrEmpty(phone))
            request.AddParameter("phone", phone);
            request.AddParameter("redirect_url", Options.payment.RedirectUrl);
            request.AddParameter("send_email", send_email);
            request.AddParameter("send_sms", send_sms);
            request.Method = Method.POST;
            var a = (RestResponse)client.Execute(request);
            return a;
        }
    }
}
