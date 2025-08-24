using System.ComponentModel.DataAnnotations;

namespace f1_store_api.Models;

public class Order
{
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    
    public User User { get; set; } = null!;
    
    [Required]
    [StringLength(50)]
    public string OrderNumber { get; set; } = string.Empty;
    
    [Required]
    public decimal TotalAmount { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Status { get; set; } = "Pending"; // Pending, Processing, Shipped, Delivered, Cancelled
    
    [StringLength(200)]
    public string? ShippingAddress { get; set; }
    
    [StringLength(100)]
    public string? ShippingCity { get; set; }
    
    [StringLength(20)]
    public string? ShippingPostalCode { get; set; }
    
    [StringLength(100)]
    public string? ShippingCountry { get; set; }
    
    public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
