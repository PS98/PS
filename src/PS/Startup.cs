using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNet.Antiforgery;
using PS.Services;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNet.Mvc;

namespace PS
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            // Set up configuration sources.
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAntiforgery();
            services.AddSession();
            services.AddCaching();
            // Add framework services.
            services.Configure<AuthMessageSenderOptions>(Configuration);
            services.Configure<AuthSocialLoginOptions>(Configuration);
            services.Configure<SmsMessageProvider>(Configuration);

            services.AddMvc(config => {
                config.Filters.Add(new RequireHttpsAttribute());
            })
            .AddJsonOptions(opt =>
            {
                opt.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });


            services.AddLogging();

            // Add application services.
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();
            services.AddTransient<IPaymentProcessor, AuthMessageSender>();
            services.AddInstance<IMongoRepository>(new MongoRepository("car"));
            services.AddTransient<IAuthService, AuthService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseSession();
            app.UseIISPlatformHandler(options => options.AuthenticationDescriptions.Clear());
            app.UseStaticFiles();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                     name: "RouteSampleA",
                     template: "admin",
                     defaults: new { controller = "Admin", action = "Index" }
                 );
                routes.MapRoute(
                    name: "Application",
                    template: "{*template}",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }

        // Entry point for the application.
        public static void Main(string[] args) => WebApplication.Run<Startup>(args);
    }
}
