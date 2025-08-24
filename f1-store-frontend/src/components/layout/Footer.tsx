import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <img src="/f1-logo.webp" alt="F1 Logo" className="footer-logo-img" />
              <span className="footer-brand-name">F1 Store</span>
            </div>
            <p className="footer-description">
              Your ultimate destination for official Formula 1 merchandise and team gear.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/teams">Teams</a></li>
              <li><a href="/drivers">Drivers</a></li>
              <li><a href="/cart">Cart</a></li>
              <li><a href="/order-history">Order History</a></li>
            </ul>
          </div>

          {/* Project Info */}
          <div className="footer-section">
            <h3 className="footer-title">Project Info</h3>
            <ul className="footer-links">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">View on GitHub</a></li>
              <li><a href="#" onClick={() => window.open('mailto:contact@example.com')}>Contact Developer</a></li>
              <li><span>React + TypeScript</span></li>
              <li><span>ASP.NET Core API</span></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; 2025 F1 Store. Built by <strong>Abdulkhaliq Alsubaie</strong> | Formula 1 and F1 are trademarks of Formula One Licensing BV.</p>
            </div>
            <div className="footer-tech-stack">
              <span className="tech-badge">React</span>
              <span className="tech-badge">TypeScript</span>
              <span className="tech-badge">ASP.NET Core</span>
              <span className="tech-badge">C#</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
