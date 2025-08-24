import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './OrderHistory.css';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../constants';
import { Price } from '../components';
import type { OrderDto } from '../types';

const OrderHistory: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    if (user) {
      fetchUserOrders();
    }
  }, [isAuthenticated, user, navigate]);

  const fetchUserOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/Order/user/${user.id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      
      const ordersData: OrderDto[] = await response.json();
      setOrders(ordersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
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

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '/placeholder-product.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${apiOrigin}/${imagePath.replace(/^\//, '')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter orders based on status and search query
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderItems.some(item => 
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="order-history-page">
        <div className="order-history-container">
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading your orders...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-page">
        <div className="order-history-container">
          <div className="error-section">
            <div className="error-icon">⚠️</div>
            <h2>Unable to Load Orders</h2>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchUserOrders}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="order-history-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Order History</h1>
          <p className="page-subtitle">Track and manage your F1 Store orders</p>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by order number or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="status-filters">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All Orders
            </button>
            <button
              className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              Pending
            </button>
            <button
              className={`filter-btn ${filterStatus === 'processing' ? 'active' : ''}`}
              onClick={() => setFilterStatus('processing')}
            >
              Processing
            </button>
            <button
              className={`filter-btn ${filterStatus === 'shipped' ? 'active' : ''}`}
              onClick={() => setFilterStatus('shipped')}
            >
              Shipped
            </button>
            <button
              className={`filter-btn ${filterStatus === 'delivered' ? 'active' : ''}`}
              onClick={() => setFilterStatus('delivered')}
            >
              Delivered
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h3>No Orders Found</h3>
            <p>
              {orders.length === 0 
                ? "You haven't placed any orders yet." 
                : "No orders match your current filters."
              }
            </p>
            <Link to="/" className="shop-now-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                {/* Order Header */}
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-number">Order #{order.orderNumber}</h3>
                    <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                    <div className="order-total">
                      <Price amount={order.totalAmount} imageSize="medium" />
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-items-preview">
                  {order.orderItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="order-item-preview">
                      <img
                        src={getImageUrl(item.imagePath)}
                        alt={item.productName}
                        className="item-preview-image"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-product.jpg';
                        }}
                      />
                      <div className="item-preview-details">
                        <h4 className="item-preview-name">{item.productName}</h4>
                        <div className="item-preview-meta">
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                      </div>
                      <div className="item-preview-price">
                        <Price amount={item.totalPrice} imageSize="small" />
                      </div>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && (
                    <div className="more-items">
                      +{order.orderItems.length - 3} more item{order.orderItems.length - 3 > 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Shipping Info */}
                {order.shippingAddress && (
                  <div className="shipping-summary">
                    <strong>Shipping to:</strong> {order.shippingCity}, {order.shippingCountry}
                  </div>
                )}

                {/* Order Actions */}
                <div className="order-actions">
                  <Link 
                    to={`/order-success/${order.orderNumber}`}
                    className="view-details-btn"
                  >
                    View Details
                  </Link>
                  {order.status.toLowerCase() === 'delivered' && (
                    <button className="reorder-btn" onClick={() => {}}>
                      Order Again
                    </button>
                  )}
                  {(order.status.toLowerCase() === 'pending' || order.status.toLowerCase() === 'processing') && (
                    <button className="track-order-btn" onClick={() => {}}>
                      Track Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {orders.length > 0 && (
          <div className="order-stats">
            <div className="stat-item">
              <span className="stat-number">{orders.length}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                <Price 
                  amount={orders.reduce((sum, order) => sum + order.totalAmount, 0)} 
                  imageSize="small" 
                />
              </span>
              <span className="stat-label">Total Spent</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {orders.filter(order => order.status.toLowerCase() === 'delivered').length}
              </span>
              <span className="stat-label">Delivered</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
