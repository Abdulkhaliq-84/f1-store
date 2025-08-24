using Microsoft.AspNetCore.Mvc;
using f1_store_api.Models.DTOs;
using f1_store_api.Services;

namespace f1_store_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    /// <summary>
    /// Get cart by user ID
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>Cart details</returns>
    [HttpGet("{userId}")]
    public async Task<ActionResult<CartDto>> GetCartByUserId(int userId)
    {
        try
        {
            var cart = await _cartService.GetCartByUserIdAsync(userId);
            
            if (cart == null)
            {
                return Ok(new CartDto { UserId = userId, CartItems = new List<CartItemDto>(), TotalAmount = 0 });
            }

            return Ok(cart);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the cart", error = ex.Message });
        }
    }

    /// <summary>
    /// Add item to cart
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="addToCartDto">Add to cart details</param>
    /// <returns>Updated cart</returns>
    [HttpPost("{userId}/items")]
    public async Task<ActionResult<CartDto>> AddToCart(int userId, [FromBody] AddToCartDto addToCartDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cart = await _cartService.AddToCartAsync(userId, addToCartDto);
            return Ok(cart);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while adding item to cart", error = ex.Message });
        }
    }

    /// <summary>
    /// Update cart item quantity
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cartItemId">Cart item ID</param>
    /// <param name="updateCartItemDto">Update cart item details</param>
    /// <returns>Updated cart</returns>
    [HttpPut("{userId}/items/{cartItemId}")]
    public async Task<ActionResult<CartDto>> UpdateCartItem(int userId, int cartItemId, [FromBody] UpdateCartItemDto updateCartItemDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var cart = await _cartService.UpdateCartItemAsync(userId, cartItemId, updateCartItemDto);
            
            if (cart == null)
            {
                return NotFound(new { message = "Cart item not found" });
            }

            return Ok(cart);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating cart item", error = ex.Message });
        }
    }

    /// <summary>
    /// Remove item from cart
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cartItemId">Cart item ID</param>
    /// <returns>Success message</returns>
    [HttpDelete("{userId}/items/{cartItemId}")]
    public async Task<ActionResult> RemoveCartItem(int userId, int cartItemId)
    {
        try
        {
            var result = await _cartService.RemoveCartItemAsync(userId, cartItemId);
            
            if (!result)
            {
                return NotFound(new { message = "Cart item not found" });
            }

            return Ok(new { message = "Item removed from cart successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while removing item from cart", error = ex.Message });
        }
    }

    /// <summary>
    /// Clear all items from cart
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <returns>Success message</returns>
    [HttpDelete("{userId}")]
    public async Task<ActionResult> ClearCart(int userId)
    {
        try
        {
            var result = await _cartService.ClearCartAsync(userId);
            
            if (!result)
            {
                return NotFound(new { message = "Cart not found" });
            }

            return Ok(new { message = "Cart cleared successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while clearing cart", error = ex.Message });
        }
    }

    /// <summary>
    /// Checkout cart and create order
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="checkoutDto">Checkout details</param>
    /// <returns>Created order</returns>
    [HttpPost("{userId}/checkout")]
    public async Task<ActionResult<OrderDto>> Checkout(int userId, [FromBody] CheckoutDto checkoutDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var order = await _cartService.CheckoutAsync(userId, checkoutDto);
            return CreatedAtAction(nameof(Checkout), new { userId }, order);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred during checkout", error = ex.Message });
        }
    }
}
