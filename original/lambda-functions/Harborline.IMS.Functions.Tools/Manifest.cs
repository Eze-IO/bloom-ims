using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;

namespace Harborline.IMS.Functions.Tools
{
    internal class Manifest
    {
        public Manifest(string nameofConfigurationFile)
        {
            ManifestName = nameofConfigurationFile;
        }

        private String ManifestName { get; set; }
        private async Task<Stream> getConfigurationFile(String name)
        {
            try
            {
                using (var client = new AmazonS3Client(
                    Amazon.RegionEndpoint.USEast2))
                {
                    MemoryStream ms = new MemoryStream();
                    using (GetObjectResponse response = await client.GetObjectAsync(Environment.GetEnvironmentVariable("CONFIG_BUCKET"), name))
                    using (Stream responseStream = response.ResponseStream)
                    {
                        responseStream.CopyTo(ms);
                        ms.Position = 0;
                        return ms;
                    }
                }
            }
            catch { throw; }
        }

        public async Task<String> GetValue(string key)
        {
            string result = null;
            try
            {
                using (var stream = await getConfigurationFile(ManifestName))
                {
                    using (XmlReader reader = XmlReader.Create(stream))
                    {
                        if(reader.ReadToFollowing(key))
                        {
                            result = reader.ReadElementContentAsString().Trim();
                        }
                        reader.Close();
                    }
                }
                return result;
            }
            catch { return null; }
        }
    }
}
