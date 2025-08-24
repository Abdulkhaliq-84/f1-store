import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../constants';
import './Navbar.css';

function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    signOut();
    setShowUserMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const getProfilePhotoUrl = (photoPath?: string) => {
    if (!photoPath) return '/f1-logo.webp'; // Default avatar
    // Remove '/api' from API_BASE_URL for static files
    const baseUrl = API_BASE_URL.replace('/api', '');
    return `${baseUrl}/${photoPath}`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Store Name */}
        <Link to="/" className="navbar-brand">
          <img src="/f1-logo.webp" alt="F1 Logo" className="logo" />
          <span className="store-name">SpeedZone</span>
        </Link>

        {/* Navigation Links */}
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/teams" className="navbar-link">Teams</Link>
          </li>
          <li className="navbar-item">
            <Link to="/drivers" className="navbar-link">Drivers</Link>
          </li>
          <li className="navbar-item">
            <Link to="/accessories" className="navbar-link">Accessories</Link>
          </li>
        </ul>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Search Bar */}
          <div className="search-container">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search" 
              className="search-input"
            />
          </div>

          {/* Wishlist/Heart Icon */}
          <button className="action-btn" aria-label="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>

          {/* Shopping Cart */}
          <Link to="/cart" className="action-btn" aria-label="Shopping Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </Link>

          {/* Auth Buttons or User Menu */}
          {isAuthenticated && user ? (
            <div className="user-menu-container" ref={menuRef}>
              <button 
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
              >
                <img 
                  src={getProfilePhotoUrl(user.profilePhotoPath)} 
                  alt={user.username}
                  className="user-avatar"
                />
                <span className="username">{user.username}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <img 
                      src={getProfilePhotoUrl(user.profilePhotoPath)} 
                      alt={user.username}
                      className="dropdown-avatar"
                    />
                    <div>
                      <p className="dropdown-username">{user.username}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                  </div>
                  
                  <hr className="dropdown-divider" />
                  
                  <Link to="/order-history" className="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Order History
                  </Link>
                  
                  {/* Admin Panel - Only show for admin@gmail.com */}
                  {user.email === 'admin@gmail.com' && (
                    <>
                      <hr className="dropdown-divider" />
                      <Link to="/admin" className="dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2-2z"></path>
                          <path d="M8 5V3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Admin Panel
                      </Link>
                      <hr className="dropdown-divider" />
                    </>
                  )}
                  <button className="dropdown-item" onClick={handleSignOut}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16,17 21,12 16,7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/signin" className="sign-in-btn">
                Sign In
              </Link>
              <Link to="/signup" className="sign-up-btn">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
