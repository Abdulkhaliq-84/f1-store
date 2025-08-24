using System.ComponentModel.DataAnnotations;

namespace f1_store_api.Models;

public class Cart
{
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    
    public User User { get; set; } = null!;
    
    public List<CartItem> CartItems { get; set; } = new List<CartItem>();
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
