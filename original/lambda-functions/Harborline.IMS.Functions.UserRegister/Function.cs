using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
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
    public class UserRegister
    {
        private Message m = new Message();
        //Get harborlineAdministrator user pool settings
        private readonly AmazonCognitoIdentityProviderClient _client = new AmazonCognitoIdentityProviderClient();
        private string _clientId = string.Empty;
        private User n = new User();

        /// <summary>
        /// Returns true if user registration is successful
        /// </summary>
        public async Task<bool> RegisterNewUser(string email, string phoneNumber, 
            string temporaryPassword, string firstName, string lastName)
        {
            try
            {
                SignUpRequest signUpRequest = new SignUpRequest()
                {
                    ClientId = _clientId,
                    Password = temporaryPassword,
                    Username = email
                };
                AttributeType nameAttribute = new AttributeType()
                {
                    Name = "name",
                    Value = string.Format("{0} {1}", firstName, lastName)
                };
                AttributeType emailAttribute = new AttributeType()
                {
                    Name = "email",
                    Value = email
                };
                AttributeType phoneNumberAttribute = new AttributeType()
                {
                    Name = "phone_number",
                    Value = phoneNumber
                };
                AttributeType typeAttribute = new AttributeType()
                {
                    Name = "custom:type",
                    Value = ((int)n.Type).ToString()
                };

                signUpRequest.UserAttributes.Add(nameAttribute);
                signUpRequest.UserAttributes.Add(emailAttribute);
                signUpRequest.UserAttributes.Add(phoneNumberAttribute);
                signUpRequest.UserAttributes.Add(typeAttribute);

                try
                {
                    n.CreatePictureUrl();
                    AttributeType pictureAttribute = new AttributeType()
                    {
                        Name = "picture",
                        Value = n.Picture
                    };
                    signUpRequest.UserAttributes.Add(pictureAttribute);
                } catch { /* ignore */ }

                var signUpResult = await _client.SignUpAsync(signUpRequest);
                m.Result = string.Format("Successful registration for user '{0}'", email);
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
                String email = null;
                String phoneNumber = null;
                String password = null;
                String firstName = null;
                String lastName = null;
                String type = ("viewer");

                input = Extension.GetJSONBody(input);

                if (input != null)
                {
                    Dictionary<string, object> d = new Dictionary<string, object>(input.ToObject<IDictionary<string, object>>(), StringComparer.CurrentCultureIgnoreCase);
                    email = d["email"].ToString() == null ? string.Empty : d["email"].ToString();
                    phoneNumber = d["phone_number"].ToString() == null ? string.Empty : d["phone_number"].ToString();
                    password = d["password"].ToString() == null ? string.Empty : d["password"].ToString();
                    firstName = d["first_name"].ToString() == null ? string.Empty : d["first_name"].ToString();
                    lastName = d["last_name"].ToString() == null ? string.Empty : d["last_name"].ToString();
                    type = d["type"].ToString() == null ? string.Empty : d["type"].ToString();

                    switch (type.ToLower())
                    {
                        case "administrator":
                            n.Type = UserPool.Administrator;
                            _clientId = await Configurations.GetClientID(UserPool.Administrator);
                            break;
                        case "editor":
                            n.Type = UserPool.Editor;
                            _clientId = await Configurations.GetClientID(UserPool.Editor);
                            break;
                        default:
                            //viewer
                            n.Type = UserPool.Viewer;
                            _clientId = await Configurations.GetClientID(UserPool.Viewer);
                            break;
                    }

                    if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(phoneNumber) ||
                        string.IsNullOrEmpty(password) || string.IsNullOrEmpty(firstName + lastName))
                        throw new ArgumentNullException("One of the parameter(s) passed is null!", new Exception());

                    m.Success = await RegisterNewUser(email, phoneNumber, password, firstName, lastName);
                }
                else
                {
                    throw new ArgumentException("Failed to understand input! Please make sure the input isn't null or empty.", new Exception());
                }

                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
            catch(Exception ex)
            {
                m.Success = false;
                m.Result = string.Format("Failed to register new user: {0}", ex.Message);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
        }
    }
}
