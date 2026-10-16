using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using Amazon.Lambda.Core;
using Bloom.IMS.Functions.Tools;
using Bloom.IMS.Functions.Tools.Helper;
using Bloom.IMS.Functions.Tools.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace Bloom.IMS.Functions
{
    public class SendConfirmation
    {
        private Message m = new Message();
        private readonly AmazonCognitoIdentityProviderClient _client = new AmazonCognitoIdentityProviderClient();

        /// <summary>
        /// Returns true if successfully sends confirmation email
        /// </summary>
        public async Task<Boolean> SendConfirmationEmail(string username, UserPool userpool)
        {
            try
            {
                var request = new ResendConfirmationCodeRequest()
                {
                    Username = username,
                    ClientId = await Configurations.GetClientID(userpool)
                };
                var response = await _client.ResendConfirmationCodeAsync(request);
                m.Success = true;
            }
            catch (Exception ex)
            {
                m.Success = false;
                m.Result = ex.Message;
            }
            return m.Success;
        }

        /// <summary>
        /// A simple function that takes a string and does a ToUpper
        /// </summary>
        /// <param name="input"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public async Task<JObject> Handler(JObject input, ILambdaContext context)
        {
            Response r = new Response();
            try
            {
                String email = null;
                bool result = false;

                input = Extension.GetJSONBody(input);

                if (input != null)
                {
                    Dictionary<string, object> d = new Dictionary<string, object>(input.ToObject<IDictionary<string, object>>(), StringComparer.CurrentCultureIgnoreCase);
                    email = d["email"].ToString() == null ? string.Empty : d["email"].ToString();

                    if (string.IsNullOrEmpty(email))
                        throw new ArgumentNullException("One of the parameter(s) passed is null!", new Exception());

                    result = await SendConfirmationEmail(email, UserPool.Administrator);
                    result = result ? result : await SendConfirmationEmail(email, UserPool.Editor);
                    result = result ? result : await SendConfirmationEmail(email, UserPool.Viewer);

                    if (result)
                    {
                        m.Success = result;
                        m.Result = "Successfully sent confirmation email!";
                        r.statusCode = 200;
                        r.body = JObject.FromObject(m).ToString(Formatting.None);
                        return JObject.FromObject(r);
                    }
                }
                else
                {
                    throw new ArgumentException("Failed to understand input! Please make sure the input isn't null or empty.", new Exception());
                }

                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
            catch (Exception ex)
            {
                m.Success = false;
                m.Result = string.Format("Failed to resend confirmation email: {0}", ex.Message);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
        }
    }
}
