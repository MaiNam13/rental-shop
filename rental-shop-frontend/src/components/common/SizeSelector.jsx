import React from 'react';

const sizes = ['S', 'M', 'L', 'XL'];

const SizeSelector = ({ selectedSize, onSizeChange }) => {
  return (
    <div className="size-selector" style={{ marginBottom: '20px' }}>
      <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Chọn Size:</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        {sizes.map(size => (
          <button
            key={size}
            onClick={() => onSizeChange(size)}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: `1px solid ${selectedSize === size ? 'var(--color-accent)' : '#ddd'}`,
              backgroundColor: selectedSize === size ? 'var(--color-accent)' : 'white',
              color: selectedSize === size ? 'white' : 'black',
              cursor: 'pointer'
            }}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
