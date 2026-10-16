using System;
using System.Data;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Amazon.Lambda.Core;
using Bloom.IMS.Functions.Tools;
using Bloom.IMS.Functions.Tools.Helper;
using Bloom.IMS.Functions.Tools.Models;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace Bloom.IMS.Functions
{
    public class GetEntity
    {
        Message m = new Message();
        /// <summary>
        /// Returns connection string for Bloom database
        /// </summary>
        public async Task<string> GetConnectionString()
        {
            return String.Format(@"Data Source={0};Initial Catalog={1};User ID={2};Password={3};",
                await Database.EndPoint(), await Database.Name(), await Database.Username(), await Database.Password());
        }

        /// <summary>
        /// Returns data from table(s) in the Bloom database
        /// </summary>
        private async Task<DataSet> GetEntityData(String tableName)
        {
            tableName = tableName.ToLower();
            DataSet dataSet = new DataSet("dataSet");
            string connectionString = await GetConnectionString();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    string queryStatement = string.Format("select * from {0};", tableName);

                    using (SqlCommand command = new SqlCommand(queryStatement, connection))
                    {
                        DataTable table = new DataTable(tableName);

                        SqlDataAdapter adapter = new SqlDataAdapter(command);

                        connection.Open();
                        adapter.Fill(table);
                        connection.Close();

                        dataSet.Tables.Add(table);
                    }
                }

                m.Success = true;
                return dataSet;
            }
            catch(Exception ex)
            {
                File.WriteAllText("error.log", ex.ToString());
                m.Success = false;
                return null;
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
            String tableName = null;
            Response r = new Response();
            try
            {
                try
                {
                    input = Extension.GetJSONBody(input);

                    if (input != null)
                        tableName = input.GetValue("entity", StringComparison.CurrentCultureIgnoreCase).ToString();
                    if (string.IsNullOrEmpty(tableName))
                        throw new ArgumentNullException("input");
                }
                catch
                {
                    m.Success = false;
                    m.Result = "Failed to understand input! Please make sure the input isn't null or empty and the entity is valid.";
                    r.statusCode = 200;
                    r.body = JObject.FromObject(m).ToString(Formatting.None);
                    return JObject.FromObject(r);
                }
                m.Success = true;
                m.Result = JsonConvert.SerializeObject(await GetEntityData(tableName));
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
            catch (Exception ex)
            {
                m.Success = false;
                m.Result = string.Format("Failed to get '{0}' entity", ex);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
        }
    }
}
