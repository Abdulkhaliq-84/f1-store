import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import './OrderSuccess.css';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../constants';
import { Price } from '../components';
import type { OrderDto } from '../types';

const OrderSuccess: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState<OrderDto | null>(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState<string | null>(null);

  const apiOrigin = useMemo(() => {
    try {
      const url = new URL(API_BASE_URL);
      return `${url.origin}${url.pathname.replace(/\/api\/?$/, '/')}`.replace(/\/$/, '');
    } catch {
      return API_BASE_URL.replace(/\/api\/?$/, '');
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    // If we don't have order data from state, fetch it
    if (!order && orderNumber) {
      fetchOrderByNumber();
    }
  }, [isAuthenticated, order, orderNumber]);

  const fetchOrderByNumber = async () => {
    if (!orderNumber) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/Order/number/${orderNumber}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.status}`);
      }
      
      const orderData: OrderDto = await response.json();
      setOrder(orderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '/placeholder-product.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${apiOrigin}/${imagePath.replace(/^\//, '')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#fbbf24';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="order-success-page">
        <div className="order-container">
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading order details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-success-page">
        <div className="order-container">
          <div className="error-section">
            <div className="error-icon">⚠️</div>
            <h2>Order Not Found</h2>
            <p>{error || 'Unable to find the order details'}</p>
            <Link to="/" className="home-btn">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="order-container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">✅</div>
          <h1 className="success-title">Order Placed Successfully!</h1>
          <p className="success-subtitle">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="order-info">
            <div className="order-info-row">
              <span className="label">Order Number:</span>
              <span className="value order-number">{order.orderNumber}</span>
            </div>
            <div className="order-info-row">
              <span className="label">Order Date:</span>
              <span className="value">{formatDate(order.createdAt)}</span>
            </div>
            <div className="order-info-row">
              <span className="label">Status:</span>
              <span 
                className="value status-badge" 
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status}
              </span>
            </div>
            <div className="order-info-row">
              <span className="label">Total Amount:</span>
              <span className="value total-amount">
                <Price amount={order.totalAmount} imageSize="medium" />
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        {order.shippingAddress && (
          <div className="shipping-info">
            <h3>Shipping Information</h3>
            <div className="shipping-address">
              <p>{order.shippingAddress}</p>
              <p>{order.shippingCity}, {order.shippingPostalCode}</p>
              <p>{order.shippingCountry}</p>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="order-items">
          <h3>Order Items</h3>
          <div className="items-list">
            {order.orderItems.map((item) => (
              <div key={item.id} className="order-item">
                <img
                  src={getImageUrl(item.imagePath)}
                  alt={item.productName}
                  className="item-image"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-product.jpg';
                  }}
                />
                
                <div className="item-details">
                  <h4 className="item-name">{item.productName}</h4>
                  <div className="item-meta">
                    {item.team && <span className="item-team">{item.team}</span>}
                    {item.size && <span className="item-size">Size: {item.size}</span>}
                  </div>
                  {item.productDescription && (
                    <p className="item-description">{item.productDescription}</p>
                  )}
                </div>

                <div className="item-pricing">
                  <div className="item-quantity">Qty: {item.quantity}</div>
                  <div className="item-price">
                    <Price amount={item.unitPrice} imageSize="small" />
                  </div>
                  <div className="item-total">
                    Total: <Price amount={item.totalPrice} imageSize="small" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Link to="/order-history" className="view-orders-btn">
            View Order History
          </Link>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>

        {/* Order Tracking Info */}
        <div className="tracking-info">
          <h3>What's Next?</h3>
          <div className="tracking-steps">
            <div className="tracking-step active">
              <div className="step-icon">📋</div>
              <div className="step-info">
                <h4>Order Confirmed</h4>
                <p>Your order has been received and is being processed</p>
              </div>
            </div>
            <div className="tracking-step">
              <div className="step-icon">📦</div>
              <div className="step-info">
                <h4>Processing</h4>
                <p>We're preparing your items for shipment</p>
              </div>
            </div>
            <div className="tracking-step">
              <div className="step-icon">🚚</div>
              <div className="step-info">
                <h4>Shipped</h4>
                <p>Your order is on its way to you</p>
              </div>
            </div>
            <div className="tracking-step">
              <div className="step-icon">🏠</div>
              <div className="step-info">
                <h4>Delivered</h4>
                <p>Your order has been delivered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
