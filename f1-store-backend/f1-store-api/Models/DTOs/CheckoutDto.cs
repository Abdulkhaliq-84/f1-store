using System.ComponentModel.DataAnnotations;

namespace f1_store_api.Models.DTOs;

public class CheckoutDto
{
    [Required]
    [StringLength(200)]
    public string ShippingAddress { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string ShippingCity { get; set; } = string.Empty;
    
    [Required]
    [StringLength(20)]
    public string ShippingPostalCode { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string ShippingCountry { get; set; } = string.Empty;
}
