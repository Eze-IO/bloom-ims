using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json.Linq;

namespace Bloom.IMS.Functions.Tools.Models
{
    public class Response
    {
        public Response()
        {
            var text = "{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Credentials':'true','Access-Control-Allow-Methods':'GET, POST, PUT, HEAD, OPTIONS','Access-Control-Allow-Headers':'content-type, Content-Type, timeout, Timeout, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-IMS-ID'}";
            headers = JObject.Parse(text);
        }
        public Boolean isBase64Encoded { get; set; }
        public int statusCode { get; set; }
        public JObject headers { get; set; }
        public String body { get; set; }
    }
}
