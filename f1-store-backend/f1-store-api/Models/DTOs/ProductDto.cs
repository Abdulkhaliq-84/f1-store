namespace f1_store_api.Models.DTOs;

public class ProductDto
{
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Team { get; set; }
    public string? Driver { get; set; }
    public string? Size { get; set; }
    public string? Description { get; set; }
    public string? ImagePath { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
