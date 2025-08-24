using System.ComponentModel.DataAnnotations;

namespace f1_store_api.Models;

public class User
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Username { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [Phone]
    [StringLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string? ProfilePhotoPath { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
