using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using System.Reflection;
using Microsoft.Data.SqlClient;
using Amazon.Lambda.Core;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Bloom.IMS.Functions.Tools;
using Bloom.IMS.Functions.Tools.Helper;
using Bloom.IMS.Functions.Tools.Models;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace Bloom.IMS.Functions
{
    public class Test
    {
        /// <summary>
        /// A function to handle JSON user input from APIs
        /// </summary>
        /// <param name="input"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public async Task<JObject> Handler(JObject input, ILambdaContext context)
        {
            Message m = new Message();
            Response r = new Response();
            try
            {
                m.Success = true;
                m.Result = Extension.GetJSONBody(input).ToString();
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            } 
            catch(Exception ex)
            {
                m.Success = false;
                m.Result = string.Format("Error: {0}", ex.ToString());
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
        }
    }
}
