using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PS.Models
{
    public class PaymentDetailsModel
    {
        [Required]
        [Display(Name = "name")]
        public string name { get; set; }

        [Required]
        [Display(Name = "purpose")]
        public string purpose { get; set; }

        [Required]
        [Display(Name = "amount")]
        public int amount { get; set; }

        [Required]
        [EmailAddress]
        [Display(Name = "email")]
        public string email { get; set; }

        [Required]
        [Display(Name = "phone")]
        public string phone { get; set; }

        [Required]
        public bool send_email { get; set; }

        [Required]
        public bool send_sms { get; set; }
    }
}
