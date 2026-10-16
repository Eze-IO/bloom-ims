using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
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
    public class ListUsers
    {
        private Message m = new Message();
        private readonly AmazonCognitoIdentityProviderClient _client = new AmazonCognitoIdentityProviderClient();

        /// <summary>
        /// Returns true if successfully get list of users
        /// </summary>
        public async Task<List<UserInformation>> GetUsers(UserPool userpool)
        {
            List<UserInformation> list = new List<UserInformation>();
            try
            {
                var request = new ListUsersRequest()
                {
                    AttributesToGet = new List<string>()
                    {
                        "name",
                        "email",
                        "phone_number",
                        "picture",
                        "custom:type"
                    },
                    UserPoolId = await Configurations.GetUserPoolID(userpool)
                };
                var response = await _client.ListUsersAsync(request);
                foreach (var u in response.Users)
                {
                    var _type = UserPool.Viewer;
                    if (Enum.TryParse(getAttribute(u.Attributes, "custom:type"), true, out UserPool up))
                        _type = up;
                    list.Add(new UserInformation()
                    {
                        Name = getAttribute(u.Attributes, "name"),
                        Email = getAttribute(u.Attributes, "email"),
                        PhoneNumber = getAttribute(u.Attributes, "phone_number"),
                        Picture = getAttribute(u.Attributes, "picture"),
                        LastModified = u.UserLastModifiedDate,
                        Created = u.UserCreateDate,
                        Username = u.Username,
                        Status = u.UserStatus,
                        Enabled = u.Enabled,
                        Type = _type,
                    });
                }
                m.Success = true;
                return list;
            }
            catch (Exception ex)
            {
                m.Success = false;
                m.Result = ex.Message;
                return list;
            }
        }

        /// <summary>
        /// Get attribute value from attribute list array
        /// </summary>
        private String getAttribute(List<AttributeType> l, string name)
        {
            try
            {
                foreach(var _l in l)
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
                var list = new List<UserInformation>();
                var al = await GetUsers(UserPool.Administrator);
                foreach(var a in al)
                    list.Add(a);
                var el = await GetUsers(UserPool.Editor);
                foreach (var e in el)
                    list.Add(e);
                var vl = await GetUsers(UserPool.Viewer);
                foreach (var v in vl)
                    list.Add(v);

                m.Result = JsonConvert.SerializeObject(list, Formatting.None);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
            catch (Exception ex)
            {
                m.Success = false;
                m.Result = string.Format("Failed to get all users: {0}", ex.Message);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
        }
    }
}
