using f1_store_api.Models.DTOs;

namespace f1_store_api.Services;

public interface ICartService
{
    Task<CartDto?> GetCartByUserIdAsync(int userId);
    Task<CartDto> AddToCartAsync(int userId, AddToCartDto addToCartDto);
    Task<CartDto?> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto updateCartItemDto);
    Task<bool> RemoveCartItemAsync(int userId, int cartItemId);
    Task<bool> ClearCartAsync(int userId);
    Task<OrderDto> CheckoutAsync(int userId, CheckoutDto checkoutDto);
}
