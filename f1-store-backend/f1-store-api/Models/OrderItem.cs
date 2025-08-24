using System.ComponentModel.DataAnnotations;

namespace f1_store_api.Models;

public class OrderItem
{
    public int Id { get; set; }
    
    [Required]
    public int OrderId { get; set; }
    
    public Order Order { get; set; } = null!;
    
    [Required]
    public int ProductId { get; set; }
    
    public Product Product { get; set; } = null!;
    
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int Quantity { get; set; }
    
    [Required]
    public decimal UnitPrice { get; set; }
    
    [Required]
    public decimal TotalPrice { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
