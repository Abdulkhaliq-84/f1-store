import React, { useEffect, useMemo, useState } from 'react';
import './ProductDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../constants';
import type { ProductDto, AddToCartDto } from '../types';

import { useAuth } from '../contexts/AuthContext';
import { Price } from '../components';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [addToCartSuccess, setAddToCartSuccess] = useState<boolean>(false);

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
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/Products/${productId}`);
        if (!res.ok) throw new Error(`Failed to load product (${res.status})`);
        const data: ProductDto = await res.json();
        if (!isMounted) return;
        setProduct(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProduct();
    return () => { isMounted = false; };
  }, [productId]);

  // Add to cart functionality
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    if (!user || !product) return;

    setAddingToCart(true);
    setError(null);

    try {
      const addToCartData: AddToCartDto = {
        productId: product.id,
        quantity: quantity,
      };

      const response = await fetch(`${API_BASE_URL}/Cart/${user.id}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addToCartData),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      // Show success message
      setAddToCartSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setAddToCartSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  return (
    <div className="product-detail">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div style={{ color: '#dc2626', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>
        )}
        {!loading && product && (
          <div className="product-overview">
            <div className="product-layout">
              {/* Product Image */}
              <div className="product-detail-image-container">
                <img 
                  src={product.imagePath ? `${apiOrigin}${product.imagePath}` : '/ferrari-shirt.jpg'} 
                  alt={product.productName} 
                  className="product-detail-image"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/ferrari-shirt.jpg'; }}
                />
              </div>

              {/* Product Information */}
              <div className="product-detail-info">
                {/* Product Name */}
                <h1 className="product-detail-name">{product.productName}</h1>
                
                {/* Product Price */}
                <div className="product-detail-price">
                  <Price amount={product.price} imageSize="large" />
                </div>
                
                {/* Product Meta */}
                <div className="product-meta">
                  {product.team && <div><strong>Team:</strong> {product.team}</div>}
                  {product.driver && <div><strong>Driver:</strong> {product.driver}</div>}
                </div>

                {/* Product Description */}
                <div className="product-description">
                  {product.description || 'No description provided.'}
                </div>
                
                {/* Size Selection */}
                {product.size && (
                  <div className="size-selection">
                    <label className="size-label">Size:</label>
                    <div className="size-options">
                      {product.size.split(',').map((s) => s.trim()).map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selection */}
                <div className="quantity-selection">
                  <label className="quantity-label">Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1 || addingToCart}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={increaseQuantity}
                      disabled={addingToCart}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Success Message */}
                {addToCartSuccess && (
                  <div className="add-to-cart-success">
                    <span className="success-icon">✓</span>
                    Item added to cart successfully!
                  </div>
                )}
                
                {/* Add to Cart Button */}
                <div className="cart-actions">
                  <button 
                    className={`add-to-cart-btn ${addingToCart ? 'loading' : ''} ${addToCartSuccess ? 'success' : ''}`}
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? (
                      <>
                        <span className="loading-spinner"></span>
                        Adding to Cart...
                      </>
                    ) : addToCartSuccess ? (
                      <>
                        <span className="success-icon">✓</span>
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <span className="cart-icon">🛒</span>
                        Add to Cart
                      </>
                    )}
                  </button>

                  {isAuthenticated ? (
                    <button 
                      className="view-cart-btn"
                      onClick={() => navigate('/cart')}
                    >
                      View Cart
                    </button>
                  ) : (
                    <p className="signin-prompt">
                      <button className="signin-link" onClick={() => navigate('/signin')}>
                        Sign in
                      </button> to add items to cart
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
