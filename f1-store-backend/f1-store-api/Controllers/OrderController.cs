using Microsoft.AspNetCore.Mvc;
using f1_store_api.Models.DTOs;
using f1_store_api.Services;

namespace f1_store_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    /// <summary>
    /// Get all orders (Admin only)
    /// </summary>
    /// <returns>List of all orders</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
    {
        try
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving orders", error = ex.Message });
        }
    }

    /// <summary>
    /// Get order by ID
    /// </summary>
    /// <param name="orderId">Order ID</param>
    /// <returns>Order details</returns>
    [HttpGet("{orderId}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(int orderId)
    {
        try
        {
            var order = await _orderService.GetOrderByIdAsync(orderId);
            
            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            return Ok(order);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the order", error = ex.Message });
        }
    }

    /// <summary>
    /// Get order by order number
    /// </summary>
    /// <param name="orderNumber">Order number</param>
    /// <returns>Order details</returns>
    [HttpGet("number/{orderNumber}")]
    public async Task<ActionResult<OrderDto>> GetOrderByOrderNumber(string orderNumber)
    {
        try
        {
            var order = await _orderService.GetOrderByOrderNumberAsync(orderNumber);
            
            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            return Ok(order);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the order", error = ex.Message });
        }
    }

    /// <summary>
    /// Get orders by user ID
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>List of user's orders</returns>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrdersByUserId(int userId)
    {
        try
        {
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving user orders", error = ex.Message });
        }
    }

    /// <summary>
    /// Get orders by status
    /// </summary>
    /// <param name="status">Order status (Pending, Processing, Shipped, Delivered, Cancelled)</param>
    /// <returns>List of orders with specified status</returns>
    [HttpGet("status/{status}")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrdersByStatus(string status)
    {
        try
        {
            var orders = await _orderService.GetOrdersByStatusAsync(status);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving orders by status", error = ex.Message });
        }
    }

    /// <summary>
    /// Update order status
    /// </summary>
    /// <param name="orderId">Order ID</param>
    /// <param name="statusDto">Order status update data</param>
    /// <returns>Updated order</returns>
    [HttpPut("{orderId}/status")]
    public async Task<ActionResult<OrderDto>> UpdateOrderStatus(int orderId, [FromBody] UpdateOrderStatusDto statusDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var order = await _orderService.UpdateOrderStatusAsync(orderId, statusDto.Status);
            return Ok(order);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating order status", error = ex.Message });
        }
    }

    /// <summary>
    /// Delete order (Admin only)
    /// </summary>
    /// <param name="orderId">Order ID</param>
    /// <returns>Success message</returns>
    [HttpDelete("{orderId}")]
    public async Task<ActionResult> DeleteOrder(int orderId)
    {
        try
        {
            var result = await _orderService.DeleteOrderAsync(orderId);
            
            if (!result)
            {
                return NotFound(new { message = "Order not found" });
            }

            return Ok(new { message = "Order deleted successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the order", error = ex.Message });
        }
    }

    /// <summary>
    /// Get total revenue (Admin only)
    /// </summary>
    /// <returns>Total revenue amount</returns>
    [HttpGet("analytics/revenue")]
    public async Task<ActionResult<decimal>> GetTotalRevenue()
    {
        try
        {
            var revenue = await _orderService.GetTotalRevenueAsync();
            return Ok(new { totalRevenue = revenue });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while calculating revenue", error = ex.Message });
        }
    }

    /// <summary>
    /// Get total orders count (Admin only)
    /// </summary>
    /// <returns>Total number of orders</returns>
    [HttpGet("analytics/count")]
    public async Task<ActionResult<int>> GetTotalOrdersCount()
    {
        try
        {
            var count = await _orderService.GetTotalOrdersCountAsync();
            return Ok(new { totalOrders = count });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while counting orders", error = ex.Message });
        }
    }
}
