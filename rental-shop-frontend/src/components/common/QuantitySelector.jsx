import React from 'react';

const QuantitySelector = ({ quantity, onQuantityChange }) => {
  return (
    <div className="quantity-selector" style={{ marginBottom: '20px' }}>
      <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Số lượng:</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button 
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          style={{ width: '30px', height: '30px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
        >
          -
        </button>
        <span>{quantity}</span>
        <button 
          onClick={() => onQuantityChange(quantity + 1)}
          style={{ width: '30px', height: '30px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
