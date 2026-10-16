using System;
using System.Collections.Generic;
using System.IO;
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
    public class UpdateUser
    {
        private Message m = new Message();
        private readonly AmazonCognitoIdentityProviderClient _client = new AmazonCognitoIdentityProviderClient();
        private string _clientId = string.Empty;
        private User u = new User();

        /// <summary>
        /// Returns true if user information is updated successfully
        /// </summary>
        public async Task<bool> UpdateUserData(String token, AttributeType attributeType)
        {
            try
            {
                var request = new UpdateUserAttributesRequest()
                {
                    UserAttributes = new List<AttributeType>()
                    {
                        attributeType
                    },
                    AccessToken = token
                };
                var response = await _client.UpdateUserAttributesAsync(request);
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
                String token = null;
                String email = null;
                String name = null;
                String phone_number = null;
                bool result = false;

                input = Extension.GetJSONBody(input);

                if (input != null)
                {
                    Dictionary<string, object> d = new Dictionary<string, object>();
                    try
                    {
                        d = new Dictionary<string, object>(input.ToObject<IDictionary<string, object>>(), StringComparer.CurrentCultureIgnoreCase);
                        phone_number = d["phone_number"].ToString() == null ? string.Empty : d["phone_number"].ToString();
                        email = d["email"].ToString() == null ? string.Empty : d["email"].ToString();
                        name = d["name"].ToString() == null ? string.Empty : d["name"].ToString();
                        token = d["token"].ToString() == null ? string.Empty : d["token"].ToString();
                    }
                    catch { /* ignore */}

                    if (string.IsNullOrEmpty(token))
                        throw new ArgumentNullException("Missing a token value!", new Exception());

                    if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(phone_number) ||
                        string.IsNullOrEmpty(email) || string.IsNullOrEmpty(token))
                        throw new ArgumentNullException("One or more of the parameter(s) passed is null!", new Exception());

                    var u = new User();
                    u.CreatePictureUrl();
                    result = await UpdateUserData(token, new AttributeType()
                    {
                        Name = "name",
                        Value = name
                    });
                    await Task.Delay(0750);
                    result = result ? result : await UpdateUserData(token, new AttributeType()
                    {
                        Name = "email",
                        Value = email
                    });
                    await Task.Delay(0750);
                    result = result ? result : await UpdateUserData(token, new AttributeType()
                    {
                        Name = "phone_number",
                        Value = phone_number
                    });

                    if (result)
                    {
                        m.Success = result;
                        m.Result = string.Format("Successfully updated user '{0}'", email);
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
                m.Result = string.Format("Failed to update user information: {0}", ex.Message);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
        }
    }
}
