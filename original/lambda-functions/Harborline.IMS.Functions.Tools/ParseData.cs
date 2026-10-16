using System;
using System.Collections.Generic;
using System.Text;

namespace Harborline.IMS.Functions
{
    public static class ParseData
    {
        public static dynamic FormatToSQL(string str)
        {

            bool boolValue;
            Int32 intValue;
            Int64 bigintValue;
            double doubleValue;
            decimal decimalValue;
            DateTime dateValue;

            // Place checks higher in if-else statement to give higher priority to type.
            if (bool.TryParse(str, out boolValue))
                return boolValue;
            else if (Int32.TryParse(str, out intValue))
                return intValue;
            else if (Int64.TryParse(str, out bigintValue))
                return bigintValue;
            else if (double.TryParse(str, out doubleValue))
                return (Decimal) doubleValue;
            else if (decimal.TryParse(str, out decimalValue))
                return decimalValue;
            else if (DateTime.TryParse(str, out dateValue))
                return string.Format("'{0}'", dateValue);
            else
                return string.Format("'{0}'", str);
        }

        public static dynamic FormatToSQL(dynamic o)
        {
            if (o is Boolean || o is Int32 || o is Int64 || o is double ||
                o is decimal || o is DateTime)
                return ParseData.FormatToSQL(o.ToString());
            return o;
        }
    }
}
