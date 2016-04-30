using System.ComponentModel.DataAnnotations;

namespace PS.Models
{
    public class ChangePasswordViewModel
    {
        [Required]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string OldPassword { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
