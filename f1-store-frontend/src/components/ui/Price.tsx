import React from 'react';
import { formatCurrencyNumber } from '../../utils';

interface PriceProps {
  amount: number;
  className?: string;
  imageSize?: 'small' | 'medium' | 'large';
  showSymbolAfter?: boolean;
}

const Price: React.FC<PriceProps> = ({ 
  amount, 
  className = '', 
  imageSize = 'medium',
  showSymbolAfter = false 
}) => {
  const getSizeStyles = () => {
    switch (imageSize) {
      case 'small':
        return { width: '14px', height: '14px' };
      case 'medium':
        return { width: '18px', height: '18px' };
      case 'large':
        return { width: '24px', height: '24px' };
      default:
        return { width: '18px', height: '18px' };
    }
  };

  const formattedAmount = formatCurrencyNumber(amount);

  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const renderSymbol = () => {
    if (imageError) {
      // Fallback to Unicode Saudi Riyal symbol if image fails
      return (
        <span 
          style={{
            fontSize: imageSize === 'small' ? '14px' : imageSize === 'large' ? '20px' : '16px',
            fontWeight: 'bold',
            color: 'inherit',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          ﷼
        </span>
      );
    }
    
    return (
      <img 
        src="/Saudi_Riyal_Symbol.png" 
        alt="SAR" 
        style={{
          ...getSizeStyles(),
          objectFit: 'contain',
          flexShrink: 0
        }}
        onError={handleImageError}
      />
    );
  };

  return (
    <span className={`price-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {!showSymbolAfter && renderSymbol()}
      <span>{formattedAmount}</span>
      {showSymbolAfter && renderSymbol()}
    </span>
  );
};

export default Price;
