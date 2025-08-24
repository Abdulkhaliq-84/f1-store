using Microsoft.EntityFrameworkCore;
using f1_store_api.Data;
using f1_store_api.Models;
using f1_store_api.Models.DTOs;
using f1_store_api.Services;

namespace f1_store_api.Services;

public class CartService : ICartService
{
    private readonly AppDbContext _context;

    public CartService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CartDto?> GetCartByUserIdAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            return null;
        }

        return MapToCartDto(cart);
    }

    public async Task<CartDto> AddToCartAsync(int userId, AddToCartDto addToCartDto)
    {
        // Check if product exists
        var product = await _context.Products.FindAsync(addToCartDto.ProductId);
        if (product == null)
        {
            throw new ArgumentException("Product not found");
        }

        // Get or create cart for user
        var cart = await _context.Carts
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        // Check if item already exists in cart
        var existingCartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == addToCartDto.ProductId);

        if (existingCartItem != null)
        {
            // Update quantity
            existingCartItem.Quantity += addToCartDto.Quantity;
            existingCartItem.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            // Add new cart item
            var cartItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = addToCartDto.ProductId,
                Quantity = addToCartDto.Quantity,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            cart.CartItems.Add(cartItem);
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Reload cart with updated data
        cart = await _context.Carts
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
            .FirstAsync(c => c.Id == cart.Id);

        return MapToCartDto(cart);
    }

    public async Task<CartDto?> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto updateCartItemDto)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            return null;
        }

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.Id == cartItemId);
        if (cartItem == null)
        {
            return null;
        }

        cartItem.Quantity = updateCartItemDto.Quantity;
        cartItem.UpdatedAt = DateTime.UtcNow;
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToCartDto(cart);
    }

    public async Task<bool> RemoveCartItemAsync(int userId, int cartItemId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            return false;
        }

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.Id == cartItemId);
        if (cartItem == null)
        {
            return false;
        }

        cart.CartItems.Remove(cartItem);
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ClearCartAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            return false;
        }

        cart.CartItems.Clear();
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<OrderDto> CheckoutAsync(int userId, CheckoutDto checkoutDto)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null || !cart.CartItems.Any())
        {
            throw new ArgumentException("Cart is empty");
        }

        // Calculate total amount
        var totalAmount = cart.CartItems.Sum(ci => ci.Product.Price * ci.Quantity);

        // Generate order number
        var orderNumber = $"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}-{userId}";

        // Create order
        var order = new Order
        {
            UserId = userId,
            OrderNumber = orderNumber,
            TotalAmount = totalAmount,
            Status = "Pending",
            ShippingAddress = checkoutDto.ShippingAddress,
            ShippingCity = checkoutDto.ShippingCity,
            ShippingPostalCode = checkoutDto.ShippingPostalCode,
            ShippingCountry = checkoutDto.ShippingCountry,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Create order items from cart items
        var orderItems = cart.CartItems.Select(ci => new OrderItem
        {
            OrderId = order.Id,
            ProductId = ci.ProductId,
            Quantity = ci.Quantity,
            UnitPrice = ci.Product.Price,
            TotalPrice = ci.Product.Price * ci.Quantity,
            CreatedAt = DateTime.UtcNow
        }).ToList();

        _context.OrderItems.AddRange(orderItems);

        // Clear the cart
        cart.CartItems.Clear();
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Reload order with items and product details
        order = await _context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstAsync(o => o.Id == order.Id);

        return MapToOrderDto(order);
    }

    private static CartDto MapToCartDto(Cart cart)
    {
        var cartDto = new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            CreatedAt = cart.CreatedAt,
            UpdatedAt = cart.UpdatedAt,
            CartItems = cart.CartItems.Select(ci => new CartItemDto
            {
                Id = ci.Id,
                ProductId = ci.ProductId,
                ProductName = ci.Product.ProductName,
                ProductDescription = ci.Product.Description,
                Team = ci.Product.Team,
                Driver = ci.Product.Driver,
                Size = ci.Product.Size,
                ImagePath = ci.Product.ImagePath,
                Price = ci.Product.Price,
                Quantity = ci.Quantity,
                TotalPrice = ci.Product.Price * ci.Quantity,
                CreatedAt = ci.CreatedAt,
                UpdatedAt = ci.UpdatedAt
            }).ToList()
        };

        cartDto.TotalAmount = cartDto.CartItems.Sum(ci => ci.TotalPrice);
        return cartDto;
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
