using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Harborline.IMS.Functions.Tools
{
    public static class Database
    {
        private static Manifest m;
        static Database()
        {
            m = new Manifest("database.xml");
        }

        public static async Task<String> EndPoint()
        {
            return await m.GetValue(nameof(EndPoint));
        }

        public static async Task<String> Name()
        {
            return await m.GetValue(nameof(Name));
        }

        public static async Task<String> Username()
        {
            return await m.GetValue(nameof(Username));
        }

        public static async Task<String> Password()
        {
            return await m.GetValue(nameof(Password));
        }
    }
}
