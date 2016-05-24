﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using PS.Services;
using PS.Models;
using System.Net;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PS.Controllers
{
    [Route("api/[controller]")]
    public class ServicesController : Controller
    {
        private MongoRepository repo = new MongoRepository("services");
        private readonly IAuthService _auth;
        private readonly IEmailSender _emailSender;
        public AuthSocialLoginOptions Options { get; }
        private readonly ISmsSender _smsSender;
        private IPaymentProcessor _paymentProcessor;

        public ServicesController(IAuthService auth, IEmailSender emailSender, ISmsSender smsSender, IPaymentProcessor paymentProcessor)
        {
            _auth = auth;
            _emailSender = emailSender;
            _smsSender = smsSender;
            _paymentProcessor = paymentProcessor;
        }

        // GET: api/values
        [HttpGet]
        
        public List<string> Get()
        {

            var coll = repo.GetAllCollectionName();

            return coll;
        }



        [HttpGet(("all"))]
        [Route("all")]
        public ServiceList GetAll()
        {
            var collections = repo.GetAllCollectionName();
            var serviceList = new ServiceList();
            serviceList.ServiceName = new string[collections.Count];

            foreach (var collName in collections)
            {
                var temp = collName.Split('.');
                serviceList.ServiceName[int.Parse(temp[0]) - 1] = temp[1];
                var service = repo.GetDocumentList<Models.Services>(collName);
                serviceList.ServiceDetails.Add(service);

            }
           

            return serviceList;
        }

        [HttpPost]
        [Route("validateOrder")]
        public JsonResult Post([FromBody] PaymentValidateModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var res = _paymentProcessor.ValidateOrder(model.PaymentId, model.PaymentRequestId);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    var data = JsonConvert.DeserializeAnonymousType(res.Content, new PaymentValidateResponseModel());
                    return Json(new { Status = 0, Result = data });
                }
                catch (Exception ex)
                {
                    Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return Json(new { Message = ex.Message });
                }
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "We are unable to process your request.", Status = 1 });
        }

        [HttpPost]
        [Route("order")]
        public JsonResult Post([FromBody] OrderDetails model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    model.Status = "Pending";
                    repo.insertDocument("orders", "Invoice", model);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Status = 0, Result = model.InvoiceNo });
                    
                }
                catch (Exception ex)
                {
                    Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return Json(new { Status = 1, Message = ex.Message });
                }
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "We are unable to process your request.", Status = 2 });
        }
    }
}
