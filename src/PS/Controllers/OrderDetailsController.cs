using System;
using System.Linq;
using Microsoft.AspNet.Mvc;
using PS.Models;
using PS.Services;
using System.Net;
using Microsoft.Extensions.OptionsModel;
using Microsoft.Extensions.PlatformAbstractions;
using PS.DTO;
using PS.Helper;
using PS.Helper.Email;
using PS.Filters;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PS.Controllers
{
    [MmAuthorize]
    [Route("api/[controller]")]
    public class OrderDetailsController : Controller
    {
        private readonly MongoRepository _repo = new MongoRepository("orders");
        private readonly EmailSender _emailSender;
        private readonly SmsProviderHelper _smsProviderHelper;
        private SmsSender _sender;

        readonly OrderDetailsDomainManager _domainManager = new OrderDetailsDomainManager();

        public OrderDetailsController(IEmailSender emailSender, ISmsSender smsSender, IOptions<SmsMessageProvider> valueOptions, IOptions<AuthSocialLoginOptions> optionsAccessor, IApplicationEnvironment appEnvironment)
        {
            _emailSender = new EmailSender(emailSender, new EmailBodyProvider(optionsAccessor, appEnvironment));
            _smsProviderHelper = new SmsProviderHelper(valueOptions);
            _sender = new SmsSender(smsSender, _smsProviderHelper);
        }

        [Route("order")]
        public JsonResult Get(string email, string status)
        {
            try
            {
                if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(status))
                {
                    if (status.Equals("All"))
                    {
                        var res = _repo.GetAllOrderWithStatus(email);
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new {Status = 0, Result = res});
                    }
                    else
                    {
                        var res = _repo.GetOrderOnStatus(status, email);
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Status = 0, Result = res });
                    }
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new {ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "We are unable to process your request.", Status = 1 });
            // return new List<OrderDetails>();
        }

        [HttpGet]
        [Route("cancelorder")]
        public JsonResult CancelOrder(string email, string invoiceNo, bool listOrder)
        {
            try
            {
                if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(invoiceNo))
                {
                    var res = _repo.CancelSelectedOrder(invoiceNo, email, listOrder);
                    var order = _domainManager.GetOrder(invoiceNo);
                    SmsSender.BookingCancelled(order);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Status = 0, Result = res,Message = "your order cancelled successfully"});
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = "We are unable to process your request.", Status = 2,error =ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "We are unable to process your request.", Status = 1 });
        }

        [HttpPost]
        [Route("editOrder")]
        public JsonResult EditOrder(string invoiceNo,  string dropOffDate, string dropOffTime, string pickUpDate, string pickUpTime)
        {
            try
            {
                if (!string.IsNullOrEmpty(invoiceNo) && !string.IsNullOrEmpty(dropOffDate) && !string.IsNullOrEmpty(pickUpDate))
                {
                    var appointment = new Appointment() { PickUpDate = new AppointmentDetails() {Day = pickUpDate,Time=pickUpTime },
                        DropOffDate = new AppointmentDetails() { Day = dropOffDate, Time = dropOffTime } };
                    _repo.ChangeAppointmentDate(invoiceNo, appointment);
                    var order = _domainManager.GetOrder(invoiceNo);
                    SmsSender.BookingUpdate(order);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Status = 0, Result = "Your Appointment Details Updated Successfully." });
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new {ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "We are unable to process your request.", Status = 1 });
        }

        [HttpGet]
        [Route("list")]
        public JsonResult ListAllOrders()
        {
            try
            {
              var orderList =   _domainManager.GetAllOrders();
                if (!orderList.Any())
                {
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Message = "We are unable to process your request.", Status = 1 });
                }
                var pendingOrder = orderList.Where(x => x.Status.Equals("Pending")).ToList();
                var cancelOrder = orderList.Where(x => x.Status.Equals("Cancelled")).ToList();
                var successorder = orderList.Where(x => x.Status.Equals("Success")).ToList();
                var result = new
                {
                    totalOrder = orderList.Count(), 
                    pendingOrderCount = pendingOrder.Count(),
                    cancelOrderCount = cancelOrder.Count(),
                    successorderCount = successorder.Count(),
                    pendingOrder,
                    cancelOrder,
                    successorder
                };
                Response.StatusCode = (int)HttpStatusCode.OK;
                return Json(new { Message = "success.", Status = 0, result });
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new {ex.Message });
            }
            
        }

        [HttpGet]
        [Route("getorder")]
        public JsonResult GetOrderById(string id)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(id))
                {
                    var order = _domainManager.GetOrder(id);
                    Response.StatusCode = (int) HttpStatusCode.OK;
                    return Json(new {Message = "Success", Status = 0, Order = order});
                }
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = "please provide OrderId", Status = 0 });
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new {ex.Message , Status = 0 });
            }
           

        }
        [HttpPost]
        [Route("updateorder")]
        public JsonResult UpdateOrderDetails([FromBody] OrderDetails order)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(order.InvoiceNo))
                {
                   var updateOrder =  _domainManager.UpdateOrderDetails(order);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Message = "Success", Status = 0, Order = updateOrder });
                }
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = "error", Status = 0 });
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new {ex.Message, Status = 0 });
            }


        }
    }
}
