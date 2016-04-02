using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Models
{
    public class MobileOTPViewModel
    {
        [Required]
        [Phone]
        [DataType(DataType.PhoneNumber)]
        [Display(Name = "MobileNumber")]
        public string MobileNumber { get; set; }
    }
}
