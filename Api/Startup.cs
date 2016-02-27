using Api;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

[assembly: OwinStartup(typeof(Startup))]
namespace Api
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //app.UseIISPlatformHandler();

            //app.Run(async (context) =>
            //{
            //    await context.Response.WriteAsync("Hello World!");
            //});

            var config = new HttpConfiguration();

            WebApiConfig.Register(config);

            ConfigureAuthZero(app);

            app.UseCors(CorsOptions.AllowAll);
            app.UseWebApi(config);
        }
    }
}