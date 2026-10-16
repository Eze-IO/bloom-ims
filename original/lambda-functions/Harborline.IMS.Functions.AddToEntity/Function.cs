using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Amazon.Lambda.Core;
using Harborline.IMS.Functions.Tools;
using Harborline.IMS.Functions.Tools.Helper;
using Harborline.IMS.Functions.Tools.Models;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace Harborline.IMS.Functions
{
    public class AddToEntity
    {
        private Message m = new Message();

        /// <summary>
        /// Returns connection string for Harborline database
        /// </summary>
        public async Task<string> GetConnectionString()
        {
            return String.Format(@"Data Source={0};Initial Catalog={1};User ID={2};Password={3};",
                await Database.EndPoint(), await Database.Name(), await Database.Username(), await Database.Password());
        }

        /// <summary>
        /// Returns true if data is successfully loaded into table(s) in the Harborline database
        /// </summary>
        private async Task<bool> InsertDataToEntity(String tableName, Dictionary<String, object> dict)
        {
            bool results = false;
            tableName = tableName.ToLower();
            string connectionString = await GetConnectionString();

            dict.Remove("entity");
            string columns = null;
            string values = null;

            foreach (var d in dict)
            {
                columns += d.Key + ",";
                values += ParseData.FormatToSQL(d.Value.ToString()) + ",";
            }

            columns = columns.Remove(columns.LastIndexOf(','));
            values = values.Remove(values.LastIndexOf(','));

            var sb = new StringBuilder(string.Format("insert into {0} ({1}) values ({2});", 
                tableName, columns, values));

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string queryStatement = string.Format(sb.ToString());

                    using (SqlCommand command = new SqlCommand(queryStatement, connection))
                    {
                        connection.Open();
                        if (command.ExecuteNonQuery() > 0)
                            results = true;
                        connection.Close();
                    }
                }

                return (m.Success = results);
            }
            catch(Exception ex)
            {
                return (m.Success = results);
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
                String tableName = null;
                bool result = false;

                input = Extension.GetJSONBody(input);

                if (input != null)
                {
                    Dictionary<string, object> d = new Dictionary<string, object>(input.ToObject<IDictionary<string, object>>(), StringComparer.CurrentCultureIgnoreCase);
                    tableName = d["entity"].ToString() == null ? string.Empty : d["entity"].ToString();
                    if (string.IsNullOrEmpty(tableName))
                        throw new ArgumentNullException("Missing a entity value!", new Exception());

                    result = await InsertDataToEntity(tableName, d);

                    if(result)
                    {
                        m.Success = result;
                        m.Result = string.Format("Successfully inserted data into '{0}' entity", tableName);
                    }
                    else
                        m.Result = string.Format("Failed to insert data into '{0}' entity", tableName);
                    
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
                m.Result = string.Format("Failed to insert data: {0}", ex.Message);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
        }
    }
}
