using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using PS.Models;
using PS.Services;
using System.Net.Http;
using System;
using System.Net;
using AutoMapper;

namespace PS.Controllers
{
    [RequireHttps]
    [Route("api/topics")]
    public class TopicsController : Controller
    {
        private IMessageBoardRepository _repo;

        public TopicsController(IMessageBoardRepository repo)
        {
            _repo = repo;
        }

        // GET: api/Topics
        [HttpGet("")]
        public IEnumerable<Topic> Get(bool includeReplies = false)
        {
            IQueryable<Topic> results;
            if (includeReplies)
            {
                results = _repo.GetTopicsIncludingReplies();
            }
            else
            {
                results = _repo.GetTopics();
            }
            var topics = results
               .OrderByDescending(t => t.Created)
               .Take(50)
               .ToList();
            //var results = Mapper.Map<IEnumerable<TopicViewModel>>(topics);
            return topics;
        }

        [HttpPost("")]
        public JsonResult Post([FromBody]Topic newTopic)
        {
            try {
                if (ModelState.IsValid)
                {
                    if (newTopic.Created == default(DateTime))
                    {
                        newTopic.Created = DateTime.UtcNow;
                    }

                    if (_repo.AddTopic(newTopic) && _repo.Save())
                    {
                        Response.StatusCode = (int)HttpStatusCode.Created;
                        return Json(Mapper.Map<Topic>(newTopic));
                    }
                    Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return Json("Failed to get the topics.");
                }
            }catch(Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json(new { Message = "Failed", ModelState = ModelState });
        }
    }
}