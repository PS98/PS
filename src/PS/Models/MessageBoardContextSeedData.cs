using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Models
{
    public class MessageBoardContextSeedData
    {
        private ApplicationDbContext _ctx;

        public MessageBoardContextSeedData(ApplicationDbContext ctx)
        {
            _ctx = ctx;
        }

        public void EnsureSeedData()
        {
            if (!_ctx.Topics.Any())
            {
                var topic = new Topic()
                {
                    Title = "I love MVC",
                    Created = DateTime.Now,
                    Body = "I love ASP.NET MVC and I want everyone to know about",
                    Replies = new List<Reply>()
                    {
                        new Reply()
                        {
                            Body = "I love it too!",
                            Created = DateTime.Now
                        },
                        new Reply()
                        {
                            Body = "me too.",
                            Created = DateTime.Now
                        },
                        new Reply()
                        {
                            Body = "I don't like it at all.",
                            Created = DateTime.Now
                        }
                    }
                };

                _ctx.Topics.Add(topic);

                var anotherTopic = new Topic()
                {
                    Title = "I like Python too!",
                    Created = DateTime.Now,
                    Body = "Python 3.0 is very popular"
                };

                _ctx.Topics.Add(anotherTopic);

                try
                {
                    _ctx.SaveChanges();
                }
                catch(Exception ex)
                {
                    var msg = ex.Message;
                }
            }
        }
    }
}
