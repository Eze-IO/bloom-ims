using System;
using System.Collections.Generic;
using System.Text;
using Bloom.IMS.Functions.Tools.Models;

namespace Bloom.IMS.Functions
{
    public class UserInformation : User
    {
        public bool Enabled { get; set; }
        public string Status { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastModified { get; set; }
        public string Username { get; set; }
    }
}
