using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Amazon.CloudFront;
using Amazon.CloudFront.Model;
using Amazon.Lambda.Core;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Harborline.IMS.Functions.Tools;
using Harborline.IMS.Functions.Tools.Helper;
using Harborline.IMS.Functions.Tools.Models;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace Harborline.IMS.Functions
{
    public class UploadUserPicture
    {

        private Message m = new Message();
        private readonly AmazonCognitoIdentityProviderClient _client = new AmazonCognitoIdentityProviderClient();

        /// <summary>
        /// Returns true if user information is updated successfully
        /// </summary>
        public async Task<bool> UpdateUserData(String email, UserPool userpool)
        {
            User u = new User();
            try
            {
                u.Type = userpool;
                u.Email = email;
                u.CreatePictureUrl();
                var request = new AdminUpdateUserAttributesRequest()
                {
                    Username = email,
                    UserAttributes = new List<AttributeType>()
                    {
                        new AttributeType()
                        {
                            Name = "picture",
                            Value = u.Picture
                        }
                    },
                    UserPoolId = await Configurations.GetUserPoolID(userpool)
                };
                var response = await _client.AdminUpdateUserAttributesAsync(request);
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
                String picture = null;
                bool result = false;

                input = Extension.GetJSONBody(input);

                if (input != null)
                {
                    Dictionary<string, object> d = new Dictionary<string, object>(input.ToObject<IDictionary<string, object>>(), StringComparer.CurrentCultureIgnoreCase);
                    email = d["email"].ToString() == null ? string.Empty : d["email"].ToString();
                    picture = d["picture"].ToString() == null ? string.Empty : d["picture"].ToString();

                    if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(picture))
                        throw new ArgumentNullException("One or more of the parameter(s) passed is null!", new Exception());

                    var regex = new Regex(@"data:(?<mime>[\w/\-\.]+);(?<encoding>\w+),(?<data>.*)", RegexOptions.Compiled);
                    var contentType = (string.IsNullOrEmpty(regex.Match(picture).Groups["mime"].Value)?"image/jpeg": regex.Match(picture).Groups["mime"].Value);

                    byte[] imageBytes = null;
                    try
                    {
                        imageBytes = Convert.FromBase64String(regex.Match(picture).Groups["data"].Value);
                    }
                    catch { throw new InvalidOperationException("Picture data uri is not valid");}
                    var size = (double)(imageBytes.Length/1024);
                    if(size>(3000))
                        throw new OutOfMemoryException("Picture file data can't be larger than 3 megabyte(s)");

                    var file = "/tmp/profile";
                    try
                    {
                        using (var client = new AmazonS3Client(
                            new BasicAWSCredentials(await Credentials.AccessKeyID(), await Credentials.SecretAccessKey()),
                            Amazon.RegionEndpoint.USEast2))
                        {
                            var request = new PutObjectRequest
                            {
                                BucketName = "harborline-ims",
                                Key = string.Format("media/images/{0}", email),
                                FilePath = file,
                                ContentType = contentType
                            };
                            using (FileStream fs = File.Open(file, FileMode.Create, FileAccess.ReadWrite,
                                FileShare.ReadWrite))
                            {
                                fs.Write(imageBytes, 0, imageBytes.Length);
                                fs.Flush();
                            }
                            var response = await client.PutObjectAsync(request);
                        }
                    }
                    catch { throw new IOException("error write/uploading image to cloud");}

                    result = await UpdateUserData(email, UserPool.Administrator);
                    result = result ? result : await UpdateUserData(email, UserPool.Editor);
                    result = result ? result : await UpdateUserData(email, UserPool.Viewer);

                    m.Success = true;
                    m.Result = ("Successfully upload image!");
                    r.statusCode = 200;
                    r.body = JObject.FromObject(m).ToString(Formatting.None);
                    return JObject.FromObject(r);
                }
                throw new ArgumentException("Failed to understand input! Please make sure the input isn't null or empty.", new Exception());
            }
            catch (Exception ex)
            {
                m.Success = false;
                m.Result = string.Format("Failed to update user profile picture: {0}", ex.Message);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
        }
    }
}
