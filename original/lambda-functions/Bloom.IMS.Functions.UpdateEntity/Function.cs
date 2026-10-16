using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Amazon.Lambda.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Bloom.IMS.Functions.Tools;
using Bloom.IMS.Functions.Tools.Helper;
using Bloom.IMS.Functions.Tools.Models;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace Bloom.IMS.Functions
{
    public class UpdateEntity
    {
        /// <summary>
        /// Returns connection string for Bloom database
        /// </summary>
        public async Task<string> GetConnectionString()
        {
            return String.Format(@"Data Source={0};Initial Catalog={1};User ID={2};Password={3};",
                await Database.EndPoint(), await Database.Name(), await Database.Username(), await Database.Password());
        }

        /// <summary>
        /// Returns true if table(s) from the Bloom database have been updated 
        /// </summary>
        private async Task<bool> UpdateEntityData(String tableName, Int64 rowID, 
            string columnName, string columnValue)
        {
            var results = false;
            tableName = tableName.ToLower();
            string connectionString = await GetConnectionString();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    var columnIDName = string.Format("{0}_id", tableName);
                    string queryStatement = string.Format("update {0} set {1}={2} where {3}={4};",
                        tableName, columnName, ParseData.FormatToSQL(columnValue), columnIDName, rowID);
 
                    using (SqlCommand command = new SqlCommand(queryStatement, connection))
                    {
                        connection.Open();
                        if (command.ExecuteNonQuery() > 0)
                            results = true;
                        connection.Close();
                    }
                }
            }
            catch
            {
                results = false;
            }
            return results;
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

            String tableName = null;
            String columnName = null;
            String columnValue = null;
            Int64 rowID = 0;

            try
            {
                input = Extension.GetJSONBody(input);

                if (input != null)
                {
                    Dictionary<string, object> d = new Dictionary<string, object>(input.ToObject<IDictionary<string, object>>(), StringComparer.CurrentCultureIgnoreCase);
                    tableName = d["entity"].ToString() == null ? string.Empty : d["entity"].ToString();
                    rowID = d["id"].ToString() == null ? 0 : (Int64)d["id"];
                    columnName = d["column"].ToString() == null ? string.Empty : d["column"].ToString();
                    //columnValue = ParseData.FormatToSQL(d["value"].ToString() == null ? string.Empty : d["value"]);
                    columnValue = d["value"].ToString() == null ? string.Empty : d["value"].ToString();
                }

                if (string.IsNullOrEmpty(tableName) || string.IsNullOrEmpty(rowID.ToString()) ||
                    string.IsNullOrEmpty(columnName) || string.IsNullOrEmpty(columnValue))
                    throw new ArgumentNullException("One or more of the parameter(s) passed is null!", new Exception());


                m.Success = await UpdateEntityData(tableName, rowID, columnName, columnValue);
                if(m.Success)
                    m.Result = string.Format("Successfully updated '{0}' entity", tableName);
                else
                    m.Result = string.Format("'{0}' entity has not been changed", tableName);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);

            }
            catch(Exception ex)
            {
                m.Success = false;
                m.Result = string.Format("Failed to update entity: {0}", ex.Message);
                r.statusCode = 200;
                r.body = JObject.FromObject(m).ToString(Formatting.None);
                return JObject.FromObject(r);
            }
        }
    }
}
