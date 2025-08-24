import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LatestItems.css';
import { API_BASE_URL } from '../../constants';
import type { ProductDto } from '../../types';

import { Price } from '../index';

const LatestItems: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Handle product card click
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  // Handle favorite button click
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add favorite logic here if needed
  };

  // Auto-scroll functionality
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      
      // If we've reached the end, reset to start
      if (scrollLeft + clientWidth >= scrollWidth - 1) {
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Scroll to the right by card width + gap
        scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
      }
    };

    // Start auto-scroll after 2 seconds, then every 3 seconds
    const timer = setTimeout(() => {
      const interval = setInterval(scroll, 3000);
      return () => clearInterval(interval);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Fetch latest products from API (max 5)
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/Products`);
        if (!res.ok) {
          throw new Error(`Failed to load products (${res.status})`);
        }
        const data: ProductDto[] = await res.json();
        if (!isMounted) return;
        const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setProducts(sorted);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const latestProducts = products.slice(0, 5);

  const apiOrigin = React.useMemo(() => {
    try {
      const url = new URL(API_BASE_URL);
      // Remove trailing /api if present
      return `${url.origin}${url.pathname.replace(/\/api\/?$/, '/')}`.replace(/\/$/, '');
    } catch {
      return API_BASE_URL.replace(/\/api\/?$/, '');
    }
  }, []);

  return (
    <section className="latest-items">
      <div className="latest-items-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Latest Items</h2>
          <p className="section-subtitle">Discover the newest additions to our F1 collection</p>
        </div>

        {error && (
          <div style={{ color: '#dc2626', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>
        )}

        {/* Horizontal Products Carousel */}
        <div ref={scrollRef} className="products-carousel">
          {!loading && latestProducts.map((product) => (
            <div 
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product.id)}
              style={{ cursor: 'pointer' }}
            >
              {/* Favorite Button */}
              <button 
                className="favorite-btn" 
                aria-label="Add to favorites"
                onClick={handleFavoriteClick}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </button>

              {/* Product Image */}
              <div className="product-image">
                <img
                  alt={product.productName}
                  src={product.imagePath ? `${apiOrigin}${product.imagePath}` : '/ferrari-shirt.jpg'}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/ferrari-shirt.jpg';
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="product-info">
                <h3 className="product-name">{product.productName}</h3>
                <div className="product-price">
                  <span className="current-price">
                    <Price amount={product.price} imageSize="small" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="section-footer">
          <button className="btn-view-all">View All Products</button>
        </div>
      </div>
    </section>
  );
};

export default LatestItems;
