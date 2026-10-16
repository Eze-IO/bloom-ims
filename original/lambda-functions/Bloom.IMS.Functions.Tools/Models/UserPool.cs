using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;

namespace Bloom.IMS.Functions.Tools.Models
{
    public enum UserPool : Byte
    {
        Viewer = 0x00,
        Editor = 0x02,
        Administrator = (Editor * Editor)
    }
}
