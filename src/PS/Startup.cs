using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using PS.Models;
using PS.Services;
using Microsoft.AspNet.Authentication.Cookies;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Authentication.OAuth;
using Microsoft.AspNet.Authentication.Google;
using Microsoft.AspNet.Authentication.Facebook;
using Microsoft.AspNet.Authentication.Twitter;
using Microsoft.AspNet.Authentication.MicrosoftAccount;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using System.Security.Claims;
using Newtonsoft.Json.Serialization;
using AutoMapper;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Identity;
using System.Net;
using Microsoft.Extensions.WebEncoders;

namespace MessageBoard
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            // Set up configuration sources.
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsDevelopment())
            {
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets();
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddEntityFramework()
                .AddSqlServer()
                .AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(Configuration["Data:DefaultConnection:ConnectionString"]));

            services.AddIdentity<ApplicationUser, IdentityRole>(config =>
            {
                config.User.RequireUniqueEmail = true;
                config.Password.RequiredLength = 8;
                config.Cookies.ApplicationCookie.LoginPath = "/Account/Login";
                config.Cookies.ApplicationCookie.Events = new CookieAuthenticationEvents()
                {
                    OnRedirectToLogin = ctx => {
                        if (ctx.Request.Path.StartsWithSegments("/api") && ctx.Response.StatusCode == (int)HttpStatusCode.OK)
                        {
                            ctx.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                        }
                        else
                        {
                            ctx.Response.Redirect(ctx.RedirectUri);
                        }
                        return Task.FromResult(0);
                    }
                };
            })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.Configure<AuthMessageSenderOptions>(Configuration);

            services.AddMvc(config => {
                config.Filters.Add(new RequireHttpsAttribute());
            })
            .AddJsonOptions(opt =>
            {
                opt.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });

            services.Configure<IdentityOptions>(options =>
            {
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10);
                options.Lockout.MaxFailedAccessAttempts = 3;
            });

            services.AddLogging();

            // Add application services.
            services.AddTransient<MessageBoardContextSeedData>();
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();
            services.AddTransient<IMessageBoardRepository, MessageBoardRepository>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, MessageBoardContextSeedData seeder,IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            //app.Map("/Home/Index", (app1) => this.Configure(app1, env, loggerFactory));
            
            app.UseIdentity();
            
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AutomaticAuthenticate = true,
                AutomaticChallenge = true,
                LoginPath = new PathString("/Account/login")
            });

            app.UseGoogleAuthentication(new GoogleOptions
            {
                ClientId = Configuration["google:clientid"],
                ClientSecret = Configuration["google:clientsecret"],
                CallbackPath = new PathString("/signin-google"),
                Events = new OAuthEvents()
                    {
                    OnRemoteError = ctx =>

                    {
                        ctx.Response.Redirect("/error?FailureMessage=" + UrlEncoder.Default.UrlEncode(ctx.Error.Message));
                        ctx.HandleResponse();
                        return Task.FromResult(0);
                    }
                }
            });

            app.UseFacebookAuthentication(new FacebookOptions
            {
                AppId = Configuration["facebook:appid"],
                AppSecret = Configuration["facebook:appsecret"],
                CallbackPath = new PathString("/signin-facebook"),
                Scope = { "email" },
                Events = new OAuthEvents()
                {
                    OnRemoteError = ctx =>

                    {
                        ctx.Response.Redirect("/error?FailureMessage=" + UrlEncoder.Default.UrlEncode(ctx.Error.Message));
                        ctx.HandleResponse();
                        return Task.FromResult(0);
                    }
                }
            });

            //app.UseTwitterAuthentication(new TwitterOptions
            //{
            //    ConsumerKey = Configuration["twitter:consumerkey"],
            //    ConsumerSecret = Configuration["twitter:consumersecret"],
            //    CallbackPath = new PathString("/signin-twitter"),
            //    Events = new TwitterEvents()
            //    {
            //        //OnRemoteFailure = ctx =>
            //        //{
            //        //    ctx.Response.Redirect("/error?FailureMessage=" + UrlEncoder.Default.Encode(ctx.Failure.Message));
            //        //    ctx.HandleResponse();
            //        //    return Task.FromResult(0);
            //        //}
            //    }
            //});

            app.UseMicrosoftAccountAuthentication(new MicrosoftAccountOptions
            {
                DisplayName = "MicrosoftAccount - Requires project changes",
                ClientId = Configuration["msa:clientid"],
                ClientSecret = Configuration["msa:clientsecret"],
                CallbackPath = new PathString("/signin-microsoft"),
                Scope = { "wl.emails" },
                Events = new OAuthEvents()
                {
                    OnRemoteError = ctx =>

                    {
                        ctx.Response.Redirect("/error?FailureMessage=" + UrlEncoder.Default.UrlEncode(ctx.Error.Message));
                        ctx.HandleResponse();
                        return Task.FromResult(0);
                    }
                }
            });

            app.UseOAuthAuthentication(new OAuthOptions
            {
                AuthenticationScheme = "GitHub",
                DisplayName = "Github",
                ClientId = Configuration["github:clientid"],
                ClientSecret = Configuration["github:clientsecret"],
                CallbackPath = new PathString("/signin-github"),
                AuthorizationEndpoint = "https://github.com/login/oauth/authorize",
                TokenEndpoint = "https://github.com/login/oauth/access_token",
                UserInformationEndpoint = "https://api.github.com/user",
                ClaimsIssuer = "OAuth2-Github",
                // Retrieving user information is unique to each provider.
                Events = new OAuthEvents
                {
                    OnCreatingTicket = async context =>
                    {
                        // Get the GitHub user
                        var request = new HttpRequestMessage(HttpMethod.Get, context.Options.UserInformationEndpoint);
                        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", context.AccessToken);
                        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                        var response = await context.Backchannel.SendAsync(request, context.HttpContext.RequestAborted);
                        response.EnsureSuccessStatusCode();

                        var user = JObject.Parse(await response.Content.ReadAsStringAsync());

                        var identifier = user.Value<string>("id");
                        if (!string.IsNullOrEmpty(identifier))
                        {
                            context.Identity.AddClaim(new Claim(
                                ClaimTypes.NameIdentifier, identifier,
                                ClaimValueTypes.String, context.Options.ClaimsIssuer));
                        }

                        var userName = user.Value<string>("login");
                        if (!string.IsNullOrEmpty(userName))
                        {
                            context.Identity.AddClaim(new Claim(
                                ClaimsIdentity.DefaultNameClaimType, userName,
                                ClaimValueTypes.String, context.Options.ClaimsIssuer));
                        }

                        var name = user.Value<string>("name");
                        if (!string.IsNullOrEmpty(name))
                        {
                            context.Identity.AddClaim(new Claim(
                                "urn:github:name", name,
                                ClaimValueTypes.String, context.Options.ClaimsIssuer));
                        }

                        var email = user.Value<string>("email");
                        if (!string.IsNullOrEmpty(email))
                        {
                            context.Identity.AddClaim(new Claim(
                                "urn:github:email", email,
                                ClaimValueTypes.String, context.Options.ClaimsIssuer));
                        }

                        var link = user.Value<string>("url");
                        if (!string.IsNullOrEmpty(link))
                        {
                            context.Identity.AddClaim(new Claim(
                                "urn:github:url", link,
                                ClaimValueTypes.String, context.Options.ClaimsIssuer));
                        }
                    },
                    OnRemoteError = ctx =>

                    {
                        ctx.Response.Redirect("/error?FailureMessage=" + UrlEncoder.Default.UrlEncode(ctx.Error.Message));
                        ctx.HandleResponse();
                        return Task.FromResult(0);
                    }
                }
            });

            Mapper.Initialize(config =>
            {
                config.CreateMap<Topic, Topic>().ReverseMap();
                config.CreateMap<Reply, Reply>().ReverseMap();
            });

            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
                loggerFactory.AddDebug(LogLevel.Information);
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                loggerFactory.AddDebug(LogLevel.Error);

                // For more details on creating database during deployment see http://go.microsoft.com/fwlink/?LinkID=615859
                try
                {
                    using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>()
                        .CreateScope())
                    {
                        serviceScope.ServiceProvider.GetService<ApplicationDbContext>()
                             .Database.Migrate();
                    }
                }
                catch { }
            }

            app.UseDeveloperExceptionPage();

            app.UseIISPlatformHandler(options => options.AuthenticationDescriptions.Clear());

            app.UseStaticFiles();

            

            // To configure external authentication please see http://go.microsoft.com/fwlink/?LinkID=532715

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

           // seeder.EnsureSeedData();
        }

        // Entry point for the application.
        public static void Main(string[] args) => WebApplication.Run<Startup>(args);
    }
}
