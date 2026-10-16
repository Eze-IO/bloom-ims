using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Bloom.IMS.Functions.Tools.Models;

namespace Bloom.IMS.Functions.Tools
{
    public static class Credentials
    {
        private static Manifest m;
        static Credentials()
        {
            m = new Manifest("general.xml");
        }

        public static async Task<String> GetRegion()
        {
            return await m.GetValue("AWSRegion");
        }

        public static async Task<String> AccessKeyID()
        {
           return await m.GetValue("AccessKeyID");
        }

        public static async Task<String> SecretAccessKey()
        {
            return await m.GetValue("SecretAccessKey");
        }

        public static async Task<String> DistributionID()
        {
            return await m.GetValue("DistributionID");
        }
    }
}
