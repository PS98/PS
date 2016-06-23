using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using PS.Models;
using PS.Services;
using System.Net;
using Newtonsoft.Json;
using PS.DTO;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PS.Controllers
{
    [Route("api/[controller]")]
    public class OrderDetailsController : Controller
    {
        private MongoRepository repo = new MongoRepository("orders");

        OrderDetailsDomainManager domainManager = new OrderDetailsDomainManager();

        [Route("order")]
        //[HttpGet("{email}/{status}")]
        public JsonResult Get(string email, string status)
        {
            try
            {
                if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(status))
                {
                    if (status.Equals("All"))
                    {
                        var res = repo.GetAllOrderWithStatus(email);
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new {Status = 0, Result = res});
                    }
                    else
                    {
                        var res = repo.GetOrderOnStatus(status, email);
                        Response.StatusCode = (int)HttpStatusCode.OK;
                        return Json(new { Status = 0, Result = res });
                    }
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.OK;
            return Json(new { Message = "We are unable to process your request.", Status = 1 });
            // return new List<OrderDetails>();
        }

        [HttpGet]
        [Route("cancelorder")]
        public JsonResult CancelOrder(string email, string invoiceNo)
        {
            try
            {
                if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(invoiceNo))
                {
                    var res = repo.CancelSelectedOrder(invoiceNo, email);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Status = 0, Result = res,Message = "your order cancelled successfully"});
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = "We are unable to process your request.", Status = 2 });
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
                    repo.ChangeAppointmentDate(invoiceNo, appointment);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Status = 0, Result = "Your Appointment Details Updated Successfully." });
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
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
              var orderList =   domainManager.GetAllOrders();
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
                return Json(new { Message = "success.", Status = 0, result = result });
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
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
                    var order = domainManager.GetOrder(id);
                    Response.StatusCode = (int) HttpStatusCode.OK;
                    return Json(new {Message = "Success", Status = 0, Order = order});
                }
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = "please provide OrderId", Status = 0 });
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message , Status = 0 });
            }
           

        }
        [HttpGet]
        [Route("updateorder")]
        public JsonResult UpdateOrderDetails(OrderDetails order)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(order.InvoiceNo))
                {
                    domainManager.UpdateOrderDetails(order);
                    Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { Message = "Success", Status = 0 });
                }
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = "error", Status = 0 });
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message, Status = 0 });
            }


        }
    }
}
