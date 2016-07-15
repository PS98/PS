using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Hosting;
using Microsoft.Extensions.OptionsModel;
using Microsoft.Extensions.PlatformAbstractions;
using PS.Services;

namespace PS.Helper.Email
{
    public class EmailBodyProvider
    {
        public AuthSocialLoginOptions Options { get; }
        private readonly IApplicationEnvironment _appEnvironment;
        public EmailBodyProvider(IOptions<AuthSocialLoginOptions> optionsAccessor, IApplicationEnvironment appEnvironment)
        {
            Options = optionsAccessor.Value;
            _appEnvironment = appEnvironment;
        }

        public string GenerateEmailBody(string emailType, Dictionary<string, string> values)
        {
            var templetPath = _appEnvironment.ApplicationBasePath + @"\\Views\\EmailTemplate\\User\\" +emailType+".html";
            var message = GetEmailBody(templetPath);
            var emailBody = CreateEmailBody(values, message);
            return emailBody;
        }

        public string GetEmailBody(string path)
        {
            string body = string.Empty;

            try
            {
                //using streamreader for reading my htmltemplate   

                using (StreamReader reader = new StreamReader(path))

                {
                    body = reader.ReadToEnd();
                }

            }
            catch (Exception ex)
            {
                
            }
            return body;

        }
        public string CreateEmailBody(Dictionary<string, string> values,string content)
        {
            var dynamicText = new SmsDynamicText();
            if (!string.IsNullOrEmpty(content))
            {
                foreach (var keyValue in dynamicText.SmsText.Where(keyValue => content.Contains(keyValue.Key)))
                {
                    string data;
                    values.TryGetValue(keyValue.Value, out data);
                    content = content.Replace(keyValue.Key, data);
                }
            }

            return content;
        }
    }
}

