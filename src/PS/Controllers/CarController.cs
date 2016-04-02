﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using PS.Services;
using PS.Models;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace PS.Controllers
{
    [Route("api/[controller]")]
    public class CarController : Controller
    {
        
        private MongoRepository _repo = new MongoRepository("car");
        // GET: api/car
        [HttpGet]
        public CarYearList Get()
        {
            var collectionList = _repo.GetAllCollectionName();
            var carlist = _repo.convertToPresentationList(collectionList);
            var yearsList = _repo.getYears();

            CarYearList list
                = new CarYearList();
            list.carList = carlist;
            list.yearsList = yearsList;
            return list;
        }

        // GET api/car/5
        [HttpGet("{collectionName}")]
        public IEnumerable<IEnumerable<string>> Get(string collectionName)
        {
            var list = _repo.GetDocumentList<Car>(collectionName);
            var collectionList = list.Select(m => m.name).ToList();
            

            return _repo.convertToPresentationList(collectionList);

        }
        [HttpGet("{collectionName}/{carName}")]
        public IEnumerable<IEnumerable<string>> GetVariant(string collectionName, string carName)
        {
            var list = _repo.GetDocumentList<Car>(collectionName);
            var varientList = list.Where(m => m.name == carName).SelectMany(y => y.varient);
            return _repo.convertToPresentationList(varientList.Select(y => y.name).ToList());
        }



        // POST api/car
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/car/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/car/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
