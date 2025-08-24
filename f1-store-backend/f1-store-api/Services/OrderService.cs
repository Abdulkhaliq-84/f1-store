using Microsoft.EntityFrameworkCore;
using f1_store_api.Data;
using f1_store_api.Models;
using f1_store_api.Models.DTOs;
using f1_store_api.Services;

namespace f1_store_api.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;

    public OrderService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToOrderDto);
    }

    public async Task<OrderDto?> GetOrderByIdAsync(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        return order == null ? null : MapToOrderDto(order);
    }

    public async Task<OrderDto?> GetOrderByOrderNumberAsync(string orderNumber)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);

        return order == null ? null : MapToOrderDto(order);
    }

    public async Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(int userId)
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToOrderDto);
    }

    public async Task<OrderDto> UpdateOrderStatusAsync(int orderId, string status)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            throw new ArgumentException("Order not found");
        }

        order.Status = status;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToOrderDto(order);
    }

    public async Task<bool> DeleteOrderAsync(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            return false;
        }

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<OrderDto>> GetOrdersByStatusAsync(string status)
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Where(o => o.Status == status)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToOrderDto);
    }

    public async Task<decimal> GetTotalRevenueAsync()
    {
        return await _context.Orders
            .Where(o => o.Status == "Delivered" || o.Status == "Processing" || o.Status == "Shipped")
            .SumAsync(o => o.TotalAmount);
    }

    public async Task<int> GetTotalOrdersCountAsync()
    {
        return await _context.Orders.CountAsync();
    }

    private static OrderDto MapToOrderDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            ShippingAddress = order.ShippingAddress,
            ShippingCity = order.ShippingCity,
            ShippingPostalCode = order.ShippingPostalCode,
            ShippingCountry = order.ShippingCountry,
            CreatedAt = order.CreatedAt,
            OrderItems = order.OrderItems.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                ProductId = oi.ProductId,
                ProductName = oi.Product.ProductName,
                ProductDescription = oi.Product.Description,
                Team = oi.Product.Team,
                Driver = oi.Product.Driver,
                Size = oi.Product.Size,
                ImagePath = oi.Product.ImagePath,
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice,
                TotalPrice = oi.TotalPrice,
                CreatedAt = oi.CreatedAt
            }).ToList()
        };
    }
}
