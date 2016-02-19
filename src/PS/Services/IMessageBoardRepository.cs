using PS.Models;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Services
{
    public interface IMessageBoardRepository
    {
        IQueryable<Topic> GetTopics();
        IQueryable<Topic> GetTopicsIncludingReplies();
        IQueryable<Reply> GetRepliesByTopic(int TopicId);

        bool Save();
        bool AddTopic(Topic newTopic);
        bool AddReply(Reply newReply);
    }
}
