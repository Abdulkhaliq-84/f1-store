import React, { useState, useEffect } from 'react';
import './HeroSection.css';

const HeroSection: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // Hero images data with overlay text
  const heroImages = [
    {
      src: '/hero-image1.png',
      title: 'Experience the Speed',
      subtitle: 'Official Formula 1 Merchandise',
      description: 'Get your favorite team gear and accessories'
    },
    {
      src: '/hero-image2.jpg', 
      title: 'Latest F1 Collection',
      subtitle: 'Premium Racing Gear',
      description: 'Discover exclusive items from top F1 teams'
    },
    {
      src: '/hero-image3.jpg',
      title: 'Join the Racing Community',
      subtitle: 'SpeedZone Exclusive',
      description: 'Shop authentic F1 merchandise and apparel'
    }
  ];

  // Auto-transition between images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Manual navigation
  const goToSlide = (index: number) => {
    setCurrentImage(index);
  };

  const nextSlide = () => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Background Images */}
        <div className="hero-images">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`hero-image ${index === currentImage ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image.src})` }}
            >
              {/* Dark overlay for better text readability */}
              <div className="hero-overlay"></div>
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">{heroImages[currentImage].title}</h1>
            <h2 className="hero-subtitle">{heroImages[currentImage].subtitle}</h2>
            <p className="hero-description">{heroImages[currentImage].description}</p>
            <div className="hero-buttons">
              <button className="btn-primary">Shop Now</button>
              <button className="btn-secondary">Explore Collections</button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button className="hero-nav prev" onClick={prevSlide} aria-label="Previous image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>
        <button className="hero-nav next" onClick={nextSlide} aria-label="Next image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>

        {/* Dot Indicators */}
        <div className="hero-indicators">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentImage ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
