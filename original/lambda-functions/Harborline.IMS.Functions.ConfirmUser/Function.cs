using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using Amazon.Lambda.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Harborline.IMS.Functions.Tools;
using Harborline.IMS.Functions.Tools.Helper;
using Harborline.IMS.Functions.Tools.Models;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace Harborline.IMS.Functions
{
    public class ConfirmUser
    {
        private Message m = new Message();
        private readonly AmazonCognitoIdentityProviderClient _client = new AmazonCognitoIdentityProviderClient();

        /// <summary>
        /// Returns true if user account has been confirmed
        /// </summary>
        public async Task<bool> IsUserConfirmed(string username, 
            string confirmationCode, UserPool userpool)
        {
            try
            {
                ConfirmSignUpRequest confirmRequest = new ConfirmSignUpRequest()
                {
                    Username = username,
                    ClientId = await Configurations.GetClientID(userpool),
                    ConfirmationCode = confirmationCode
                };
                var confirmResult = await _client.ConfirmSignUpAsync(confirmRequest);
                return (m.Success = true);
            }
            catch (Exception ex)
            {
                m.Result = ex.Message;
                return (m.Success = false);
            }
        }

        /// <summary>
        /// A function to handle JSON user input from APIs
        /// </summary>
        /// <param name="input"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        public async Task<JObject> Handler(JObject input, ILambdaContext context)
        {
            Response r = new Response();
            try
            {
                input = Extension.GetJSONBody(input);

                String email = null;
                String confirmationCode = null;
                bool result = false;

                if (input != null)
                {
                    Dictionary<string, object> d = new Dictionary<string, object>(input.ToObject<IDictionary<string, object>>(), StringComparer.CurrentCultureIgnoreCase);
                    email = d["email"].ToString() == null ? string.Empty : d["email"].ToString();
                    confirmationCode = d["code"].ToString() == null ? string.Empty : d["code"].ToString();

                    if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(confirmationCode))
                        throw new ArgumentNullException("One or more of the parameter(s) passed is null!", new Exception());

                    result = await IsUserConfirmed(email, confirmationCode, UserPool.Administrator);
                    result = result ? result : await IsUserConfirmed(email, confirmationCode, UserPool.Editor);
                    result = result ? result : await IsUserConfirmed(email, confirmationCode, UserPool.Viewer);

                    if (result)
                    {
                        m.Success = true;
                        m.Result = string.Format("'{0}' user account is confirmed", email);
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
                m.Result = string.Format("Failed to confirm user: {0}", ex.Message);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
        }
    }
}
