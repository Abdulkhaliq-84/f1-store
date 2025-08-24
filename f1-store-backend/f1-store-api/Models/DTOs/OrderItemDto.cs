namespace f1_store_api.Models.DTOs;

public class OrderItemDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ProductDescription { get; set; }
    public string? Team { get; set; }
    public string? Driver { get; set; }
    public string? Size { get; set; }
    public string? ImagePath { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime CreatedAt { get; set; }
}
