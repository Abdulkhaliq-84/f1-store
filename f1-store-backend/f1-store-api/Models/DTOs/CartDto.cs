namespace f1_store_api.Models.DTOs;

public class CartDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public List<CartItemDto> CartItems { get; set; } = new List<CartItemDto>();
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
