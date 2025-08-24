using System.ComponentModel.DataAnnotations;

namespace f1_store_api.Models.DTOs;

public class UpdateCartItemDto
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; }
}
