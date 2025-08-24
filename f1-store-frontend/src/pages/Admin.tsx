import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants';
import type { ProductDto, OrderDto, OrderAnalyticsDto, UpdateOrderStatusDto } from '../types';
import { Price } from '../components';
import './Admin.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [analytics, setAnalytics] = useState<OrderAnalyticsDto>({ totalRevenue: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/Products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/Users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      // Filter out admin user
      const filteredUsers = data.filter((user: any) => user.username !== 'Admin');
      setUsers(filteredUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/Order`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics from API
  const fetchAnalytics = async () => {
    try {
      const [revenueResponse, countResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/Order/analytics/revenue`),
        fetch(`${API_BASE_URL}/Order/analytics/count`)
      ]);

      if (!revenueResponse.ok || !countResponse.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const revenueData = await revenueResponse.json();
      const countData = await countResponse.json();

      setAnalytics({
        totalRevenue: revenueData.totalRevenue,
        totalOrders: countData.totalOrders
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      // Don't set error state for analytics, just log it
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: number, status: string) => {
    setUpdatingOrderStatus(prev => new Set(prev).add(orderId));
    
    try {
      const updateData: UpdateOrderStatusDto = { status };
      const response = await fetch(`${API_BASE_URL}/Order/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh orders data
      await fetchOrders();
      await fetchAnalytics(); // Update analytics after status change
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
      console.error('Error updating order status:', err);
    } finally {
      setUpdatingOrderStatus(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchOrders();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  // Fetch users when users tab is selected
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Fetch orders when orders tab is selected
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products', icon: '🏁' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'teams', label: 'Teams', icon: '🏎️' },
    { id: 'drivers', label: 'Drivers', icon: '👨‍💼' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="admin-dashboard">
            <div className="stats-grid">
              <div className="stat-card products-card">
                <div className="stat-icon">🏁</div>
                <div className="stat-content">
                  <h3>Total Products</h3>
                  <p className="stat-number">{products.length}</p>
                  <span className="stat-label">Products Available</span>
                </div>
              </div>
              <div className="stat-card orders-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <h3>Total Orders</h3>
                  <p className="stat-number">{analytics.totalOrders}</p>
                  <span className="stat-label">Orders Placed</span>
                </div>
              </div>
              <div className="stat-card revenue-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>Revenue</h3>
                  <p className="stat-number revenue-amount">
                    <Price amount={analytics.totalRevenue} imageSize="small" />
                  </p>
                  <span className="stat-label">Total Earnings</span>
                </div>
              </div>
              <div className="stat-card users-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>Active Users</h3>
                  <p className="stat-number">{users.length}</p>
                  <span className="stat-label">Registered Users</span>
                </div>
              </div>
            </div>
            
                         <div className="recent-activity">
               <h3>Recent Activity</h3>
               <div className="activity-list">
                 {products.length > 0 && (
                   <div className="activity-item">
                     <div className="activity-icon">🏁</div>
                     <div className="activity-content">
                       <p>Total Products: {products.length} products available</p>
                       <span className="activity-time">Updated just now</span>
                     </div>
                   </div>
                 )}
                 {users.length > 0 && (
                   <div className="activity-item">
                     <div className="activity-icon">👥</div>
                     <div className="activity-content">
                       <p>Active Users: {users.length} registered users</p>
                       <span className="activity-time">Updated just now</span>
                     </div>
                   </div>
                 )}
                 {products.length > 0 && (
                   <div className="activity-item">
                     <div className="activity-icon">🆕</div>
                     <div className="activity-content">
                       <p>Latest Product: {products[0]?.productName || 'No products yet'}</p>
                       <span className="activity-time">
                         {products[0]?.createdAt ? new Date(products[0].createdAt).toLocaleDateString() : 'N/A'}
                       </span>
                     </div>
                   </div>
                 )}
               </div>
             </div>
          </div>
        );
      
      case 'products':
        return (
          <div className="admin-products">
            <div className="section-header">
              <h3>Product Management</h3>
              <button 
                className="btn-primary" 
                onClick={() => navigate('/admin/add-product')}
              >
                Add New Product
              </button>
            </div>
            
            {loading && (
              <div className="loading-state">
                <p>Loading products...</p>
              </div>
            )}
            
            {error && (
              <div className="error-state">
                <p>Error: {error}</p>
                <button onClick={fetchProducts} className="btn-secondary">Retry</button>
              </div>
            )}
            
            {!loading && !error && (
              <div className="products-table">
                {products.length === 0 ? (
                  <div className="empty-state">
                    <p>No products found. Add your first product to get started!</p>
                  </div>
                ) : (
                  <table>
                    <thead>
                                             <tr>
                         <th>Image</th>
                         <th>Name</th>
                         <th>Team</th>
                         <th>Driver</th>
                         <th>Size</th>
                         <th>Price</th>
                         <th>Created</th>
                         <th>Actions</th>
                       </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>
                            {product.imagePath ? (
                              <img 
                                src={`${API_BASE_URL.replace('/api', '')}${product.imagePath}`} 
                                alt={product.productName} 
                                className="product-thumbnail" 
                              />
                            ) : (
                              <div className="no-image">No Image</div>
                            )}
                          </td>
                                                     <td>{product.productName}</td>
                           <td>{product.team || '-'}</td>
                           <td>{product.driver || '-'}</td>
                           <td>{product.size || '-'}</td>
                           <td>
                             <Price amount={product.price} imageSize="small" />
                           </td>
                           <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                          <td className="actions-cell">
                            <button className="btn-small">Edit</button>
                            <button className="btn-small danger">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        );
      
      case 'orders':
        return (
          <div className="admin-orders">
            <div className="section-header">
              <h3>Order Management</h3>
              <div className="order-stats">
                <span>Total Orders: {orders.length}</span>
                <span>Pending: {orders.filter(o => o.status === 'Pending').length}</span>
                <span>Processing: {orders.filter(o => o.status === 'Processing').length}</span>
                <span>Shipped: {orders.filter(o => o.status === 'Shipped').length}</span>
                <span>Delivered: {orders.filter(o => o.status === 'Delivered').length}</span>
              </div>
            </div>
            
            {loading ? (
              <div className="loading-state">Loading orders...</div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={fetchOrders} className="retry-btn">Retry</button>
              </div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <p>No orders found</p>
              </div>
            ) : (
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order Number</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Shipping</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="order-number">#{order.orderNumber}</td>
                        <td className="order-items">
                          <div className="items-summary">
                            {order.orderItems.slice(0, 2).map((item, index) => (
                              <span key={item.id}>
                                {item.productName}
                                {index < order.orderItems.slice(0, 2).length - 1 && ', '}
                              </span>
                            ))}
                            {order.orderItems.length > 2 && (
                              <span> +{order.orderItems.length - 2} more</span>
                            )}
                          </div>
                          <div className="items-count">
                            {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} items
                          </div>
                        </td>
                        <td className="order-total">
                          <Price amount={order.totalAmount} imageSize="small" className="order-price" />
                        </td>
                        <td>
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            disabled={updatingOrderStatus.has(order.id)}
                            className={`status-select status-${order.status.toLowerCase()}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="order-date">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="shipping-info">
                          {order.shippingCity && order.shippingCountry ? (
                            <div className="shipping-address">
                              <div>{order.shippingCity}</div>
                              <div className="shipping-country">{order.shippingCountry}</div>
                            </div>
                          ) : (
                            <span className="no-shipping">N/A</span>
                          )}
                        </td>
                        <td className="order-actions">
                          <button 
                            className="btn-small view-btn"
                            onClick={() => navigate(`/order-success/${order.orderNumber}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      
             case 'users':
         return (
           <div className="admin-users">
             <div className="section-header">
               <h3>User Management</h3>
               <button className="btn-primary">Add New User</button>
             </div>
             
             {loading && (
               <div className="loading-state">
                 <p>Loading users...</p>
               </div>
             )}
             
             {error && (
               <div className="error-state">
                 <p>Error: {error}</p>
                 <button onClick={fetchUsers} className="btn-secondary">Retry</button>
               </div>
             )}
             
             {!loading && !error && (
               <div className="users-table">
                 {users.length === 0 ? (
                   <div className="empty-state">
                     <p>No users found.</p>
                   </div>
                 ) : (
                   <table>
                     <thead>
                       <tr>
                         <th>Avatar</th>
                         <th>Username</th>
                         <th>Email</th>
                         <th>Phone</th>
                         <th>Joined</th>
                         <th>Status</th>
                         <th>Actions</th>
                       </tr>
                     </thead>
                     <tbody>
                       {users.map((user) => (
                         <tr key={user.id}>
                           <td>
                             {user.profilePhotoPath ? (
                               <img src={`${API_BASE_URL.replace('/api', '')}${user.profilePhotoPath}`} alt="User" className="user-avatar" />
                             ) : (
                               <img src="/f1-logo.webp" alt="User" className="user-avatar" />
                             )}
                           </td>
                           <td>{user.username}</td>
                           <td>{user.email}</td>
                           <td>{user.phoneNumber || '-'}</td>
                           <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                           <td><span className="status active">Active</span></td>
                           <td className="actions-cell">
                             <button className="btn-small">Edit</button>
                             <button className="btn-small danger">Suspend</button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 )}
               </div>
             )}
           </div>
         );
      
      default:
        return (
          <div className="admin-placeholder">
            <h3>{tabs.find(tab => tab.id === activeTab)?.label}</h3>
            <p>This section is under development. Coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your F1 store operations</p>
      </div>
      
      <div className="admin-container">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="admin-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default Admin;

