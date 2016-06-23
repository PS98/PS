using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using MongoDB.Driver;
using PS.Models;
using PS.Services;

namespace PS.DTO
{
    public class OrderDetailsDomainManager
    {
        private MongoRepository _repo;
       public OrderDetailsDomainManager()
        {
             _repo = new MongoRepository("orders");
         }

        public List<OrderDetails> GetAllOrders()
        {
            try
            {
                var orders = _repo.GetDocumentList<OrderDetails>("Invoice");
                 return orders;
            }
            catch (Exception ex)
            {
                // ReSharper disable once PossibleIntendedRethrow
                throw ex;
            }
        }

        public OrderDetails GetOrder(string id)
        {
            var filter = Builders<OrderDetails>.Filter.Where(x => x.InvoiceNo.Equals(id));
            var collection = _repo.GetCollection<OrderDetails>("Invoice");
            var orderList = collection.Find(filter).ToListAsync().Result;

            var order = orderList.Any() ? orderList.FirstOrDefault() : new OrderDetails();
            return order;
        }

        public void UpdateOrderDetails(OrderDetails updateOrder)
        {
            var collection = _repo.GetCollection<OrderDetails>("Pune");
            var filter = Builders<OrderDetails>.Filter.Where(x => x.InvoiceNo.Equals(updateOrder.InvoiceNo));
            collection.ReplaceOneAsync(filter, updateOrder);
        }
    }
}
