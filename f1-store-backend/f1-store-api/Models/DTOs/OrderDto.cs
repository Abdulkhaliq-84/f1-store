namespace f1_store_api.Models.DTOs;

public class OrderDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ShippingAddress { get; set; }
    public string? ShippingCity { get; set; }
    public string? ShippingPostalCode { get; set; }
    public string? ShippingCountry { get; set; }
    public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();
    public DateTime CreatedAt { get; set; }
}
