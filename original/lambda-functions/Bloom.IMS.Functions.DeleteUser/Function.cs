using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.Lambda.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Bloom.IMS.Functions.Tools;
using Bloom.IMS.Functions.Tools.Helper;
using Bloom.IMS.Functions.Tools.Models;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace Bloom.IMS.Functions
{
    public class DeleteUser
    {

        private Message m = new Message();
        private readonly AmazonCognitoIdentityProviderClient _client = new AmazonCognitoIdentityProviderClient();
        private User u = new User();

        /// <summary>
        /// Returns true if user is successfully deleted
        /// </summary>
        public async Task<bool> RemoveUser(string username, UserPool userpool)
        {
            try
            {
                var request = new AdminDeleteUserRequest()
                {
                    Username = username,
                    UserPoolId = await Configurations.GetUserPoolID(userpool)
                };
                var response = await _client.AdminDeleteUserAsync(request);
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

                String username = null;
                bool result = false;

                if (input != null)
                {
                    Dictionary<string, object> d = new Dictionary<string, object>(input.ToObject<IDictionary<string, object>>(), StringComparer.CurrentCultureIgnoreCase);
                    username = d["username"].ToString() == null ? string.Empty : d["username"].ToString();

                    if (string.IsNullOrEmpty(username))
                        throw new ArgumentNullException("One of the parameter(s) passed is null!", new Exception());

                    result = await RemoveUser(username, UserPool.Administrator);
                    result = result ? result : await RemoveUser(username, UserPool.Editor);
                    result = result ? result : await RemoveUser(username, UserPool.Viewer);

                    if (result)
                    {
                        m.Success = true;
                        m.Result = string.Format("'{0}' user account has been deleted!", username);
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
                m.Result = string.Format("Failed to delete user: {0}", ex.Message);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
        }
    }

}
