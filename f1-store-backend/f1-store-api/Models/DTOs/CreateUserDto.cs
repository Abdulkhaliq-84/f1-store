using System.ComponentModel.DataAnnotations;

namespace f1_store_api.Models.DTOs;

public class CreateUserDto
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
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
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;
    
    [Required]
    [Compare("Password", ErrorMessage = "Password and confirmation password do not match.")]
    public string ConfirmPassword { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string? ProfilePhotoPath { get; set; }
}
