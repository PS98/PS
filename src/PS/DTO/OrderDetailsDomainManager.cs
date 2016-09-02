using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using PS.Models;
using PS.Services;
using PS.Helper;
using PS.Helper.Email;

namespace PS.DTO
{
    public class OrderDetailsDomainManager
    {
        private MongoRepository _repo;
        private readonly EmailSender _emailSender;
        private readonly SmsProviderHelper _smsProviderHelper;
        private SmsSender _sender;

        public OrderDetailsDomainManager()
        {
            _repo = new MongoRepository("orders");
        }

        public List<OrderDetails> GetAllOrders(int? centreId, UserSession userDetails)
        {
            try
            {
                var id = centreId == null ? "" : centreId.ToString();
                var orders = new List<OrderDetails>();

                if (userDetails.CentreId == "0" && string.IsNullOrEmpty(id))
                    // if super admin and no centre id then return all order
                {
                    orders = _repo.GetDocumentList<OrderDetails>("Invoice");
                }
               else if(userDetails.CentreId == "0" && !string.IsNullOrEmpty(id))   
                    // if super admin and centre id not null then return centre specific order
                {
                    var filter = Builders<OrderDetails>.Filter.Where(x => x.SelectedCentre.Id == id);
                    var collection = _repo.GetCollection<OrderDetails>("Invoice");
                    orders = collection.Find(filter).ToListAsync().Result;
                }
                   
               else if(!string.IsNullOrEmpty(userDetails.CentreId))   //user is admin then return all centre specific data
                {
                    var filter = Builders<OrderDetails>.Filter.Where(x => x.SelectedCentre.Id == userDetails.CentreId);
                    var collection = _repo.GetCollection<OrderDetails>("Invoice");
                    orders = collection.Find(filter).ToListAsync().Result;
                }
               
                return orders;
            }
            catch (Exception ex)
            {
                // ReSharper disable once PossibleIntendedRethrow
                throw ex;
            }
        }

        public OrderDetails GetOrder(string id, string centreId)
        {
            var filter = centreId != "0" ?
                Builders<OrderDetails>.Filter.Where(x => x.InvoiceNo.Equals(id) && x.SelectedCentre.Id == centreId) :
                Builders<OrderDetails>.Filter.Where(x => x.InvoiceNo.Equals(id));
            var collection = _repo.GetCollection<OrderDetails>("Invoice");
            var orderList = collection.Find(filter).ToListAsync().Result;
            var order = orderList.Any() ? orderList.FirstOrDefault() : null;
            return order;
        }

        public OrderDetails UpdateOrderDetails(OrderDetails updateOrder)
        {
            var collection = _repo.GetCollection<OrderDetails>("Invoice");
            var order = GetOrder(updateOrder.InvoiceNo, updateOrder.UserDetails.Email);
            UpdateOrder(order, updateOrder);
            var filter = Builders<OrderDetails>.Filter.Where(x => x.Id == order.Id);
            collection.ReplaceOneAsync(filter, order);
            return order;
        }

        private void UpdateOrder(OrderDetails existingOrderDetails, OrderDetails updatedOrderDetails)
        {
            if (existingOrderDetails.Status != updatedOrderDetails.Status)
            {
                SmsSender.OrderStatusUpdate(updatedOrderDetails);
            }
            else if (existingOrderDetails.Changed(updatedOrderDetails))
            {
                SmsSender.ServiceOrderUpdate(updatedOrderDetails);
            }
            if (updatedOrderDetails.QuotationRevision.Status != "Select")
            {
                SmsSender.QuotationUpdates(updatedOrderDetails);
                if (existingOrderDetails.QuotationRevision == null)
                {
                    existingOrderDetails.QuotationRevision = new QuotationRevision()
                    {
                        ServiceDetails = new List<Detalis>()
                    };
                }
                existingOrderDetails.QuotationRevision.ServiceDetails.AddRange(existingOrderDetails.SelectedCentre.ServiceDetails);
            }
            existingOrderDetails.SelectedAppointment = updatedOrderDetails.SelectedAppointment;

            existingOrderDetails.SelectedCentre.PhoneNo = updatedOrderDetails.SelectedCentre.PhoneNo;
            existingOrderDetails.SelectedCentre.TotalActualPrice = updatedOrderDetails.SelectedCentre.TotalActualPrice;
            existingOrderDetails.SelectedCentre.ServiceDetails = updatedOrderDetails.SelectedCentre.ServiceDetails;
            existingOrderDetails.SelectedCentre.Address = updatedOrderDetails.SelectedCentre.Address;
            // existingOrderDetails.SelectedCentre.Email = updatedOrderDetails.SelectedCentre.Email;

            existingOrderDetails.Status = updatedOrderDetails.Status;

            existingOrderDetails.SelectedCar = updatedOrderDetails.SelectedCar;

            existingOrderDetails.UserDetails = updatedOrderDetails.UserDetails;

            existingOrderDetails.SelectedServices = updatedOrderDetails.SelectedServices;


        }
    }
}
