using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using Amazon.Lambda.Core;
using Harborline.IMS.Functions.Tools.Helper;
using Harborline.IMS.Functions.Tools.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace Harborline.IMS.Functions
{
    public class GetUser
    {
        private Message m = new Message();
        //Get harborlineAdministrator user pool settings
        private readonly AmazonCognitoIdentityProviderClient _client = new AmazonCognitoIdentityProviderClient();
        private User u = new User();

        /// <summary>
        /// Returns true if user information is successful retrieved
        /// </summary>
        public async Task<bool> GetUserData(string token)
        {
            try
            {
                var request = new GetUserRequest()
                {
                    AccessToken = token
                };
                var response = await _client.GetUserAsync(request);
                var attributes = response.UserAttributes;
                var _u = new User();
                _u.CreatePictureUrl();

                var _type = UserPool.Viewer;
                var _typeResult = getAttribute(attributes, "custom:type");
                switch(_typeResult.ToLower()){
                    case "4":
                        _type = UserPool.Administrator;
                        break;
                    case "2":
                        _type = UserPool.Editor;
                        break;
                    default:
                        _type = UserPool.Viewer;
                        break;
                }

                u = new User()
                {
                    Name = (string.IsNullOrEmpty(getAttribute(attributes, "name")) ? response.Username : getAttribute(attributes, "name")),
                    Email = (string.IsNullOrEmpty(getAttribute(attributes, "email")) ? response.Username : getAttribute(attributes, "email")),
                    PhoneNumber = (string.IsNullOrEmpty(getAttribute(attributes, "phone_number")) ? response.Username : getAttribute(attributes, "phone_number")),
                    Picture = (string.IsNullOrEmpty(getAttribute(attributes, "picture")) ? _u.Picture : getAttribute(attributes, "picture")),
                    Type = _type
                };
                return (m.Success = true);
            }
            catch (Exception ex)
            {
                m.Result = ex.Message;
                return (m.Success = false);
            }
        }

        /// <summary>
        /// Get attribute value from attribute list array
        /// </summary>
        private String getAttribute(List<AttributeType> l, string name)
        {
            try
            {
                foreach (var _l in l)
                    if (_l.Name.ToLower() == name.ToLower())
                        return _l.Value;
                return string.Empty;
            }
            catch
            {
                return string.Empty;
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
                bool result = false;

                input = Extension.GetJSONBody(input);

                if (input != null)
                {
                    Dictionary<string, object> d = new Dictionary<string, object>(input.ToObject<IDictionary<string, object>>(), StringComparer.CurrentCultureIgnoreCase);
                    token = d["token"].ToString() == null ? string.Empty : d["token"].ToString();

                    if (string.IsNullOrEmpty(token))
                        throw new ArgumentNullException("Missing a token value!", new Exception());

                    result = await GetUserData(token);

                    if (result)
                    {
                        m.Success = (await GetUserData(token) != result ? result : await GetUserData(token));
                        m.Result = JObject.FromObject(u).ToString(Formatting.None);
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
                m.Result = string.Format("Failed to retrieve user information: {0}", ex.Message);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
        }
    }
}
