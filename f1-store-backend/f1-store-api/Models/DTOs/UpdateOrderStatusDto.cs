using System.ComponentModel.DataAnnotations;

namespace f1_store_api.Models.DTOs;

public class UpdateOrderStatusDto
{
    [Required]
    [StringLength(50)]
    public string Status { get; set; } = string.Empty;
}
