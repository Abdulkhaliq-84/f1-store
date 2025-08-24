import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import './TeamProducts.css';
import { API_BASE_URL } from '../constants';
import type { ProductDto } from '../types';

import { Price } from '../components';

const TeamProducts: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  // Team information
  const teamInfo: Record<string, any> = {
    'mercedes': {
      name: 'Mercedes',
      apiName: 'Mercedes',
      fullName: 'Mercedes-AMG Petronas F1 Team',
      color: '#00d2be',
      logo: '/teams/mercedes.png'
    },
    'red-bull': {
      name: 'Red Bull Racing',
      apiName: 'Red Bull',
      fullName: 'Oracle Red Bull Racing',
      color: '#1e41ff',
      logo: '/teams/redbull.png'
    },
    'ferrari': {
      name: 'Ferrari',
      apiName: 'Ferrari',
      fullName: 'Scuderia Ferrari',
      color: '#dc143c',
      logo: '/teams/ferrari.png'
    },
    'mclaren': {
      name: 'McLaren',
      apiName: 'McLaren',
      fullName: 'McLaren F1 Team',
      color: '#ff8700',
      logo: '/teams/mclaren.png'
    },
    'alpine': {
      name: 'Alpine',
      apiName: 'Alpine',
      fullName: 'BWT Alpine F1 Team',
      color: '#0082fa',
      logo: '/teams/alpine.png'
    },
    'aston-martin': {
      name: 'Aston Martin',
      apiName: 'Aston Martin',
      fullName: 'Aston Martin Aramco Cognizant F1 Team',
      color: '#006847',
      logo: '/teams/astonmartin.png'
    },
    'williams': {
      name: 'Williams',
      apiName: 'Williams',
      fullName: 'Williams Racing',
      color: '#005aff',
      logo: '/teams/willams.png'
    },
    'haas': {
      name: 'Haas',
      apiName: 'Haas',
      fullName: 'MoneyGram Haas F1 Team',
      color: '#333333',
      logo: '/teams/haas.png'
    },
    'racing-bulls': {
      name: 'Racing Bulls',
      apiName: 'Racing Bulls',
      fullName: 'Visa Cash App RB F1 Team',
      color: '#2b4562',
      logo: '/teams/racing-bulls.png'
    },
    'kick': {
      name: 'Kick Sauber',
      apiName: 'Kick Sauber',
      fullName: 'Stake F1 Team Kick Sauber',
      color: '#900000',
      logo: '/teams/kick.png'
    }
  };

  const currentTeam = teamInfo[teamId || ''];

  const teamQueryName: string | undefined = currentTeam?.apiName || currentTeam?.name;

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
    const fetchTeamProducts = async () => {
      if (!teamQueryName) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/Products/team/${encodeURIComponent(teamQueryName)}`);
        if (!res.ok) {
          throw new Error(`Failed to load ${teamQueryName} products (${res.status})`);
        }
        const data: ProductDto[] = await res.json();
        if (!isMounted) return;
        setProducts(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load team products');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTeamProducts();
    return () => { isMounted = false; };
  }, [teamQueryName]);

  // Remove sample products; using real API data

  if (!currentTeam) {
    return (
      <div className="team-products-page">
        <div className="team-error-container">
          <h1>Team Not Found</h1>
          <p>The team you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/teams')} className="team-back-btn">
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="team-products-page" style={{ '--team-color': currentTeam.color } as React.CSSProperties}>
      <div className="team-products-container">
        {/* Team Header */}
        <div className="team-header">
          <button onClick={() => navigate('/teams')} className="team-back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
            Back to Teams
          </button>
          
          <div className="team-banner">
            <img 
              src={currentTeam.logo} 
              alt={`${currentTeam.name} Logo`} 
              className="team-banner-logo"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/100x100/${currentTeam.color.replace('#', '')}/ffffff?text=${currentTeam.name}`;
              }}
            />
            <div className="team-banner-info">
              <h1 className="team-banner-title">{currentTeam.fullName}</h1>
              <p className="team-banner-subtitle">Official {currentTeam.name} Merchandise</p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="team-products-section">
          <div className="team-section-header">
            <h2 className="team-section-title">Shop {currentTeam.name} Products</h2>
            <p className="team-section-subtitle">
              Discover official {currentTeam.name} merchandise and show your team spirit
            </p>
          </div>

          {error && (
            <div className="team-error-container" style={{ color: '#dc2626', textAlign: 'center', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div className="team-products-grid">
            {!loading && products.length === 0 && (
              <div className="team-error-container" style={{ padding: '2rem' }}>
                <p>No products found for {currentTeam.name}.</p>
              </div>
            )}
            {!loading && products.map((product) => (
              <div
                key={product.id}
                className="team-product-card"
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: 'pointer' }}
              >
                {/* Favorite Button */}
                <button className="team-favorite-btn" aria-label="Add to favorites">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </button>

                {/* Product Image */}
                <div className="team-product-image">
                  <img
                    alt={product.productName}
                    src={product.imagePath ? `${apiOrigin}${product.imagePath}` : '/ferrari-shirt.jpg'}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/ferrari-shirt.jpg';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="team-product-info">
                  <h3 className="team-product-name">{product.productName}</h3>
                  <div className="team-product-price">
                    <span className="team-current-price">
                      <Price amount={product.price} imageSize="small" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default TeamProducts;
