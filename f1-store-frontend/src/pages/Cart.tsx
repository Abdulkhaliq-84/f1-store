import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../constants';

import type { CartDto, CartItemDto, UpdateCartItemDto, CheckoutDto, OrderDto } from '../types';
import { Price } from '../components';

const Cart: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const apiOrigin = useMemo(() => {
    try {
      const url = new URL(API_BASE_URL);
      return `${url.origin}${url.pathname.replace(/\/api\/?$/, '/')}`.replace(/\/$/, '');
    } catch {
      return API_BASE_URL.replace(/\/api\/?$/, '');
    }
  }, []);

  // Fetch cart data
  const fetchCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/Cart/${user.id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch cart: ${response.status}`);
      }
      
      const cartData: CartDto = await response.json();
      setCart(cartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (!user || newQuantity < 1) return;

    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    
    try {
      const updateData: UpdateCartItemDto = { quantity: newQuantity };
      const response = await fetch(`${API_BASE_URL}/Cart/${user.id}/items/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      const updatedCart: CartDto = await response.json();
      setCart(updatedCart);
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  // Remove item from cart
  const removeItem = async (cartItemId: number) => {
    if (!user) return;

    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    
    try {
      const response = await fetch(`${API_BASE_URL}/Cart/${user.id}/items/${cartItemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      // Refresh cart data
      await fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove item');
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  // Handle checkout
  const handleCheckout = async (checkoutData: CheckoutDto) => {
    if (!user) return;

    setCheckoutLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/Cart/${user.id}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const order: OrderDto = await response.json();
      
      // Clear cart and redirect to order success page
      setCart(null);
      navigate(`/order-success/${order.orderNumber}`, { 
        state: { order } 
      });
    } catch (err) {
      console.error('Error during checkout:', err);
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
      setShowCheckout(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    fetchCart();
  }, [user, isAuthenticated, navigate]);

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '/placeholder-product.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${apiOrigin}/${imagePath.replace(/^\//, '')}`;
  };

  if (!isAuthenticated) {
    return null; // Will redirect to signin
  }

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-loading">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading your cart...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-error">
            <div className="error-icon">⚠️</div>
            <div className="error-message">{error}</div>
            <button className="retry-btn" onClick={fetchCart}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.cartItems.length === 0;

  if (isEmpty) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <h1 className="cart-title">Shopping Cart</h1>
          </div>
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2 className="empty-cart-title">Your cart is empty</h2>
            <p className="empty-cart-text">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/" className="continue-shopping-btn">
              <span>🏎️</span>
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
        </div>

        <div className="cart-items">
          {cart.cartItems.map((item: CartItemDto) => (
            <div key={item.id} className="cart-item">
              <img
                src={getImageUrl(item.imagePath)}
                alt={item.productName}
                className="cart-item-image"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-product.jpg';
                }}
              />
              
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.productName}</h3>
                
                <div className="cart-item-meta">
                  {item.team && (
                    <span className="cart-item-team">{item.team}</span>
                  )}
                  {item.size && (
                    <span className="cart-item-size">{item.size}</span>
                  )}
                </div>
                
                {item.productDescription && (
                  <p className="cart-item-description">{item.productDescription}</p>
                )}
                
                <div className="cart-item-status">
                  <span className="status-icon">✓</span>
                  <span className="status-text">In stock</span>
                </div>
              </div>

              <div className="cart-item-price">
                <Price amount={item.price} imageSize="medium" />
              </div>

              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={updatingItems.has(item.id)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                  disabled={updatingItems.has(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row summary-total">
            <span className="summary-label">Total</span>
            <span className="summary-value">
              <Price amount={cart.totalAmount} imageSize="large" />
            </span>
          </div>

          <button
            className="checkout-btn"
            onClick={() => setShowCheckout(true)}
            disabled={checkoutLoading || updatingItems.size > 0}
          >
            {checkoutLoading ? 'Processing...' : 'Checkout'}
          </button>

          <div className="continue-link">
            <Link to="/">or Continue Shopping →</Link>
          </div>
        </div>

        {/* Simple Checkout Modal */}
        {showCheckout && (
          <CheckoutModal
            onCheckout={handleCheckout}
            onCancel={() => setShowCheckout(false)}
            loading={checkoutLoading}
          />
        )}
      </div>
    </div>
  );
};

// Simple Checkout Modal Component
interface CheckoutModalProps {
  onCheckout: (data: CheckoutDto) => void;
  onCancel: () => void;
  loading: boolean;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ onCheckout, onCancel, loading }) => {
  const [formData, setFormData] = useState<CheckoutDto>({
    shippingAddress: '',
    shippingCity: '',
    shippingPostalCode: '',
    shippingCountry: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckout(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Shipping Information</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Address
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, shippingAddress: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '1rem',
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              City
            </label>
            <input
              type="text"
              required
              value={formData.shippingCity}
              onChange={(e) => setFormData(prev => ({ ...prev, shippingCity: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '1rem',
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Postal Code
              </label>
              <input
                type="text"
                required
                value={formData.shippingPostalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, shippingPostalCode: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '1rem',
                }}
              />
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Country
              </label>
              <input
                type="text"
                required
                value={formData.shippingCountry}
                onChange={(e) => setFormData(prev => ({ ...prev, shippingCountry: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                  fontSize: '1rem',
                }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#333',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#dc143c',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
              }}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cart;