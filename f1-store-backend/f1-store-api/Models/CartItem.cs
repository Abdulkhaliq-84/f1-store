using System.ComponentModel.DataAnnotations;

namespace f1_store_api.Models;

public class CartItem
{
    public int Id { get; set; }
    
    [Required]
    public int CartId { get; set; }
    
    public Cart Cart { get; set; } = null!;
    
    [Required]
    public int ProductId { get; set; }
    
    public Product Product { get; set; } = null!;
    
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
