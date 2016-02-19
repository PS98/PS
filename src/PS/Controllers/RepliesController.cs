using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using PS.Models;
using PS.Services;
using System.Net.Http;
using System.Net;
using AutoMapper;

namespace PS.Controllers
{
    [RequireHttps]
    [Route("api/topics/{topicId}/replies")]
    public class RepliesController : Controller
    {
        private IMessageBoardRepository _repo;

        public RepliesController(IMessageBoardRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("")]
        public IEnumerable<Reply> Get(int topicId)
        {
            return _repo.GetRepliesByTopic(topicId);
        }

        [HttpPost("")]
        public JsonResult Post(int topicId, [FromBody]Reply newReply)
        {
            try {
                if (ModelState.IsValid)
                {
                    if (newReply.Created == default(DateTime))
                    {
                        newReply.Created = DateTime.UtcNow;
                    }

                    newReply.TopicId = topicId;

                    if (_repo.AddReply(newReply) && _repo.Save())
                    {
                        Response.StatusCode = (int)HttpStatusCode.Created;
                        return Json(Mapper.Map<Reply>(newReply));
                    }
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { Message = ex.Message });
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Failed to get the replies.");
        }
    }
}
