using f1_store_api.Models.DTOs;

namespace f1_store_api.Services;

public interface IOrderService
{
    Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
    Task<OrderDto?> GetOrderByIdAsync(int orderId);
    Task<OrderDto?> GetOrderByOrderNumberAsync(string orderNumber);
    Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(int userId);
    Task<OrderDto> UpdateOrderStatusAsync(int orderId, string status);
    Task<bool> DeleteOrderAsync(int orderId);
    Task<IEnumerable<OrderDto>> GetOrdersByStatusAsync(string status);
    Task<decimal> GetTotalRevenueAsync();
    Task<int> GetTotalOrdersCountAsync();
}
