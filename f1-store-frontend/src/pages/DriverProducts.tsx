import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import './DriverProducts.css';
import { API_BASE_URL } from '../constants';
import type { ProductDto } from '../types';

import { Price } from '../components';

const DriverProducts: React.FC = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);



  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setSelectedProduct(null);
  };

  // Driver information
  const driverInfo: Record<string, any> = {
    'max-verstappen': {
      name: 'Max Verstappen',
      apiName: 'Max Verstappen',
      fullName: 'Max Emilian Verstappen',
      team: 'Red Bull Racing',
      nationality: 'Dutch',
      image: '/drivers/max.png',
      carNumber: 1,
      color: '#1e41ff'
    },
    'lewis-hamilton': {
      name: 'Lewis Hamilton',
      apiName: 'Lewis Hamilton',
      fullName: 'Lewis Carl Davidson Hamilton',
      team: 'Ferrari',
      nationality: 'British',
      image: '/drivers/lewis.png',
      carNumber: 44,
      color: '#dc143c'
    },
    'charles-leclerc': {
      name: 'Charles Leclerc',
      apiName: 'Charles Leclerc',
      fullName: 'Charles Marc Hervé Perceval Leclerc',
      team: 'Ferrari',
      nationality: 'Monégasque',
      image: '/drivers/charles.png',
      carNumber: 16,
      color: '#dc143c'
    },
    'lando-norris': {
      name: 'Lando Norris',
      apiName: 'Lando Norris',
      fullName: 'Lando Norris',
      team: 'McLaren',
      nationality: 'British',
      image: '/drivers/lando.png',
      carNumber: 4,
      color: '#ff8700'
    },
    'george-russell': {
      name: 'George Russell',
      apiName: 'George Russell',
      fullName: 'George William Russell',
      team: 'Mercedes',
      nationality: 'British',
      image: '/drivers/george.png',
      carNumber: 63,
      color: '#00d2be'
    },
    'oscar-piastri': {
      name: 'Oscar Piastri',
      apiName: 'Oscar Piastri',
      fullName: 'Oscar Jack Piastri',
      team: 'McLaren',
      nationality: 'Australian',
      image: '/drivers/oscar.png',
      carNumber: 81,
      color: '#ff8700'
    },
    'fernando-alonso': {
      name: 'Fernando Alonso',
      apiName: 'Fernando Alonso',
      fullName: 'Fernando Alonso Díaz',
      team: 'Aston Martin',
      nationality: 'Spanish',
      image: '/drivers/fernando alonso .png',
      carNumber: 14,
      color: '#006847'
    }
  };

  const currentDriver = driverInfo[driverId || ''];
  const driverQueryName: string | undefined = currentDriver?.apiName || currentDriver?.name;

  const apiOrigin = useMemo(() => {
    try {
      const url = new URL(API_BASE_URL);
      return `${url.origin}${url.pathname.replace(/\/api\/?$/, '/')}`.replace(/\/$/, '');
    } catch {
      return API_BASE_URL.replace(/\/api\/?$/, '');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchDriverProducts = async () => {
      if (!driverQueryName) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/Products/driver/${encodeURIComponent(driverQueryName)}`);
        if (!res.ok) throw new Error(`Failed to load ${driverQueryName} products (${res.status})`);
        const data: ProductDto[] = await res.json();
        if (!isMounted) return;
        setProducts(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load driver products');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDriverProducts();
    return () => { isMounted = false; };
  }, [driverQueryName]);

  // Using real API data; sample products removed

  if (!currentDriver) {
    return (
      <div className="driver-products-page">
        <div className="driver-error-container">
          <h1>Driver Not Found</h1>
          <p>The driver you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/drivers')} className="driver-back-btn">
            Back to Drivers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-products-page" style={{ '--driver-color': currentDriver.color } as React.CSSProperties}>
      <div className="driver-products-container">
        {/* Driver Header */}
        <div className="driver-header">
          <button onClick={() => navigate('/drivers')} className="driver-back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
            Back to Drivers
          </button>
          
          <div className="driver-banner">
            <img 
              src={currentDriver.image} 
              alt={`${currentDriver.name} Photo`} 
              className="driver-banner-photo"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/100x100/${currentDriver.color.replace('#', '')}/ffffff?text=${currentDriver.name}`;
              }}
            />
            <div className="driver-banner-info">
              <h1 className="driver-banner-title">{currentDriver.fullName}</h1>
              <p className="driver-banner-subtitle">
                #{currentDriver.carNumber} • {currentDriver.team} • {currentDriver.nationality}
              </p>
              <p className="driver-banner-description">Official {currentDriver.name} Merchandise</p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="driver-products-section">
          <div className="driver-section-header">
            <h2 className="driver-section-title">Shop {currentDriver.name} Products</h2>
            <p className="driver-section-subtitle">
              Discover official {currentDriver.name} merchandise and show your driver support
            </p>
          </div>

          {error && (
            <div className="driver-error-container" style={{ color: '#dc2626' }}>{error}</div>
          )}

          <div className="driver-products-grid">
            {!loading && products.length === 0 && (
              <div className="driver-error-container" style={{ padding: '2rem' }}>
                <p>No products found for {currentDriver.name}.</p>
              </div>
            )}
            {!loading && products.map((product) => (
              <div
                key={product.id}
                className="driver-product-card"
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: 'pointer' }}
              >
                {/* Favorite Button */}
                <button className="driver-favorite-btn" aria-label="Add to favorites">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </button>

                {/* Product Image */}
                <div className="driver-product-image">
                  <img
                    src={product.imagePath ? `${apiOrigin}${product.imagePath}` : '/ferrari-shirt.jpg'}
                    alt={product.productName}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/ferrari-shirt.jpg'; }}
                  />
                </div>

                {/* Product Info */}
                <div className="driver-product-info">
                  <h3 className="driver-product-name">{product.productName}</h3>
                  <div className="driver-product-price">
                    <span className="driver-current-price">
                      <Price amount={product.price} imageSize="small" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && selectedProduct && (
        <div className="quick-view-modal">
          <div className="quick-view-content">
            <button className="close-btn" onClick={handleCloseQuickView}>×</button>
            <h3>{selectedProduct.productName}</h3>
            <p><Price amount={selectedProduct.price} imageSize="medium" /></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverProducts;
