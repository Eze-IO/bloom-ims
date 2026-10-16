using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Harborline.IMS.Functions.Tools.Helper
{
    public static class Extension
    {
        public static JObject GetJSONBody(JObject o)
        {
            try
            {
                if (o != null)
                {
                    try
                    {
                        Dictionary<string, object> dict = new Dictionary<string, object>(o.ToObject<IDictionary<string, object>>(),
                            StringComparer.CurrentCultureIgnoreCase);
                        return (JObject.Parse(dict["body"].ToString()));
                    }
                    catch { /* ignore */ }
                }
                return o;
            }
            catch { return o; }
        }
    }
}
