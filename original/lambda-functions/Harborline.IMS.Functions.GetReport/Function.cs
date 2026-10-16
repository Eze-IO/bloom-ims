using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Amazon.Lambda.Core;
using Harborline.IMS.Functions.Tools;
using Harborline.IMS.Functions.Tools.Helper;
using Harborline.IMS.Functions.Tools.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace Harborline.IMS.Functions
{
    public class GetReport
    {

        /// <summary>
        /// Returns connection string for Harborline database
        /// </summary>
        public async Task<string> GetConnectionString()
        {
            return String.Format(@"Data Source={0};Initial Catalog={1};User ID={2};Password={3};",
                await Database.EndPoint(), await Database.Name(), await Database.Username(), await Database.Password());
        }

        /// <summary>
        /// Returns results from function(s) in the Harborline database have been updated 
        /// </summary>
        private async Task<DataSet> GetEntityFunctionResults(String functionName, List<string> parameters)
        {
            functionName = functionName.ToLower();
            DataSet dataSet = new DataSet("dataSet");
            string connectionString = await GetConnectionString();

            try
            {
                string _params = string.Empty;
                for (int i = 0; i < parameters.ToArray().Length; i++)
                {
                    if (i == 0)
                        _params += ParseData.FormatToSQL(parameters[i]);
                    else
                        _params += ", " + ParseData.FormatToSQL(parameters[i]);
                }
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    functionName = string.Format("{0}.dbo.{1}", await Database.Name(), functionName);
                    string queryStatement = string.Format("exec {0} {1};", functionName, _params);

                    using (SqlCommand command = new SqlCommand(queryStatement, connection))
                    {
                        DataTable table = new DataTable(functionName);

                        SqlDataAdapter adapter = new SqlDataAdapter(command);

                        connection.Open();
                        adapter.Fill(table);
                        connection.Close();

                        dataSet.Tables.Add(table);
                    }
                }

                return dataSet;
            }
            catch (Exception ex)
            {
                throw;
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
            Message m = new Message();
            Response r = new Response();

            String functionName = null;
            object _params = null;
            List<string> o = new List<string>();

            try
            {
                input = Extension.GetJSONBody(input);

                if (input != null)
                {
                    Dictionary<string, object> d = new Dictionary<string, object>(input.ToObject<IDictionary<string, object>>(), StringComparer.CurrentCultureIgnoreCase);
                    functionName = d["name"].ToString() == null ? string.Empty : d["name"].ToString();
                    _params = d["params"] == null ? input : d["params"];
                    try
                    {
                        var x = JsonConvert.DeserializeObject<string[]>(_params.ToString());
                        foreach (var _x in x)
                            o.Add(_x);

                    } catch { /* ignore */ }
                }

                if (string.IsNullOrEmpty(functionName))
                    throw new ArgumentNullException("One of the parameter(s) passed is null!", new Exception());


                m.Success = true;
                m.Result = JsonConvert.SerializeObject(await GetEntityFunctionResults(functionName, o));
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);

            }
            catch (Exception ex)
            {
                m.Success = false;
                m.Result = string.Format("Failed to get report results: {0}", ex.Message);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
        }
    }
}
