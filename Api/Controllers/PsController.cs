using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Api.Controllers
{
    [Authorize]
    public class PsController : ApiController
    {
        public IHttpActionResult Get()
        {
            return Ok();
        }
    }
}
