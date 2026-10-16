using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Harborline.IMS.Functions.Tools;
using Harborline.IMS.Functions.Tools.Helper;
using Harborline.IMS.Functions.Tools.Models;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using Amazon.Lambda.Core;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace Harborline.IMS.Functions
{
    public class ChangePassword
    {
        private Message m = new Message();
        private readonly AmazonCognitoIdentityProviderClient _client = new AmazonCognitoIdentityProviderClient();
        private string _clientId = string.Empty;
        private User u = new User();

        /// <summary>
        /// Returns true if user password is successful updated
        /// </summary>
        public async Task<bool> ChangeUserPassword(string token, string currentPassword, 
            string newPassword)
        {
            try
            {
                var request = new ChangePasswordRequest()
                {
                    AccessToken = token,
                    PreviousPassword = currentPassword,
                    ProposedPassword = newPassword
                };
                var response = await _client.ChangePasswordAsync(request);
                if(response.HttpStatusCode==HttpStatusCode.Accepted)
                    return (m.Success = true);
            }
            catch (Exception ex)
            {
                m.Result = ex.Message;
            }
            return (m.Success = false);
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
                String token = null;
                String currentPassword = null;
                String newPassword = null;
                bool result = false;

                input = Extension.GetJSONBody(input);

                if (input != null)
                {
                    Dictionary<string, object> d = new Dictionary<string, object>(input.ToObject<IDictionary<string, object>>(), StringComparer.CurrentCultureIgnoreCase);
                    currentPassword = d["current"].ToString() == null ? string.Empty : d["current"].ToString();
                    newPassword = d["new"].ToString() == null ? string.Empty : d["new"].ToString();
                    token = d["token"].ToString() == null ? string.Empty : d["token"].ToString();

                    if (string.IsNullOrEmpty(token))
                        throw new ArgumentNullException("Missing a token value!", new Exception());

                    if(newPassword.Trim()==currentPassword.Trim())
                        throw new ArgumentNullException("The new password cannot match the current password!", new Exception());

                    if (string.IsNullOrEmpty(currentPassword) || string.IsNullOrEmpty(newPassword) || string.IsNullOrEmpty(token))
                        throw new ArgumentNullException("One or more of the parameter(s) passed is null!", new Exception());

                    m.Success = result = await ChangeUserPassword(token, currentPassword, newPassword);

                    if (result)
                    {
                        m.Result = "Successfully updated user's password";
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
                m.Result = string.Format("Failed to update user's password: {0}", ex.Message);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
        }
    }
}
