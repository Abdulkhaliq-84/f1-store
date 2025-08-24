namespace f1_store_api.Models.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? ProfilePhotoPath { get; set; }
    public DateTime CreatedAt { get; set; }
}
