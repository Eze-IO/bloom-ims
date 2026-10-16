using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Harborline.IMS.Functions.Tools.Models;

namespace Harborline.IMS.Functions.Tools
{
    public static class Configurations
    {
        private static Manifest m;
        static Configurations()
        {
            m = new Manifest("cognito.xml");
        }

        public static async Task<String> GetRegion()
        {
            return await m.GetValue("AWSRegion");
        }

        public static async Task<String> GetClientID(UserPool userPool)
        {
            switch (userPool)
            {
                case UserPool.Administrator:
                    return await m.GetValue("AdministratorClientID");
                case UserPool.Editor:
                    return await m.GetValue("EditorClientID");
                default:
                    return await m.GetValue("ViewerClientID");
            }
        }

        public static async Task<String> GetUserPoolID(UserPool userPool)
        {
            switch (userPool)
            {
                case UserPool.Administrator:
                    return await m.GetValue("AdministratorUserPoolID");
                case UserPool.Editor:
                    return await m.GetValue("EditorUserPoolID");
                default:
                    return await m.GetValue("ViewerUserPoolID");
            }
        }
    }
}
