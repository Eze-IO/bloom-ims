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
    public class TokenRequester
    {
        private Message m = new Message();
        private readonly AmazonCognitoIdentityProviderClient _client = new AmazonCognitoIdentityProviderClient();
        private Token token = new Token();

        /// <summary>
        /// Returns true if user credentials are correct & defines token
        /// </summary>
        public async Task<bool> SignIn(string username, string password, UserPool userpool)
        {
            try
            {
                var authReq = new AdminInitiateAuthRequest()
                {
                    UserPoolId = await Configurations.GetUserPoolID(userpool),
                    ClientId = await Configurations.GetClientID(userpool),
                    AuthFlow = AuthFlowType.ADMIN_NO_SRP_AUTH
                };
                authReq.AuthFlow = AuthFlowType.ADMIN_NO_SRP_AUTH;
                authReq.AuthParameters.Add("USERNAME", username);
                authReq.AuthParameters.Add("PASSWORD", password);

                AdminInitiateAuthResponse authResp = await _client.AdminInitiateAuthAsync(authReq);
                token.ID = authResp.AuthenticationResult.IdToken;
                token.AccessKey = authResp.AuthenticationResult.AccessToken;

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
                String username = null;
                String password = null;
                bool result = false;

                input = Extension.GetJSONBody(input);

                if (input != null)
                {
                    Dictionary<string, object> d = new Dictionary<string, object>(input.ToObject<IDictionary<string, object>>(), StringComparer.CurrentCultureIgnoreCase);
                    username = d["username"].ToString() == null ? string.Empty : d["username"].ToString();
                    password = d["password"].ToString() == null ? string.Empty : d["password"].ToString();

                    if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                        throw new ArgumentNullException("One or more of the parameter(s) passed is null!", new Exception());

                    result = await SignIn(username, password, UserPool.Administrator);
                    result = result ? result : await SignIn(username, password, UserPool.Editor);
                    result = result ? result : await SignIn(username, password, UserPool.Viewer);

                    if(result)
                    {
                        m.Success = true;
                        m.Result = string.Format("Successfully signed in '{0}' user & produced token", username);
                        m.Result = JObject.FromObject(token).ToString(Formatting.None);
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
                m.Result = string.Format("Failed to get user token: {0}", ex.Message);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
        }
    }
}
