using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PS.Models;
using Microsoft.Data.Entity;
using RestSharp;
using RestSharp.Authenticators;

namespace PS.Services
{
    public class MessageBoardRepository : IMessageBoardRepository
    {
        private ApplicationDbContext _ctx;

        public MessageBoardRepository(ApplicationDbContext ctx)
        {
            _ctx = ctx;
        }

        public bool AddReply(Reply newReply)
        {
            try
            {
                _ctx.Replies.Add(newReply);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public bool AddTopic(Topic newTopic)
        {
            try
            {
                _ctx.Topics.Add(newTopic);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public IQueryable<Reply> GetRepliesByTopic(int TopicId)
        {
            return _ctx.Replies.Where(t => t.TopicId == TopicId);
        }

        public IQueryable<Topic> GetTopics()
        {
           return _ctx.Topics;
        }

        public IQueryable<Topic> GetTopicsIncludingReplies()
        {
            return _ctx.Topics.Include(t => t.Replies);
        }

        public bool Save()
        {
            try
            {
                return _ctx.SaveChanges() > 0;
            }
            catch(Exception)
            {
                return false;
            }
        }
    }
}
