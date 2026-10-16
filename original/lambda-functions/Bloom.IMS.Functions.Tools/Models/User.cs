using System;
using System.Collections.Generic;
using System.Text;

namespace Bloom.IMS.Functions.Tools.Models
{
    public class User
    {
        public User() 
        { 
            this.Token = new Token();
        }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Picture { get; set; }
        public UserPool Type { get; set; }
        public Token Token { get; set; }

        public void CreatePictureUrl()
        {
            if (string.IsNullOrEmpty(this.Email))
                this.Picture = ("https://YOUR-BUCKET.s3.amazonaws.com/media/images/user_default.png");
            else
                this.Picture = string.Format("https://YOUR-BUCKET.s3.amazonaws.com/media/images/{0}", 
                     this.Email);
        }
    }
}
