using System.ComponentModel.DataAnnotations;

namespace f1_store_api.Models.DTOs;

public class CreateProductDto
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string ProductName { get; set; } = string.Empty;
    
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }
    
    [StringLength(100)]
    public string? Team { get; set; }
    
    [StringLength(100)]
    public string? Driver { get; set; }
    
    [StringLength(10)]
    public string? Size { get; set; }
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    public IFormFile? Image { get; set; }
}
