import React, { useState } from 'react';

const ProductGallery = ({ images = [], name }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Nếu không có ảnh nào, không hiển thị gì
  if (!images || images.length === 0) return null;

  // Nếu chỉ có 1 ảnh, hiển thị đơn giản
  if (images.length === 1) {
    return (
      <div className="product-gallery-container">
        <div className="main-image-wrapper">
          <img src={images[0]} alt={name} />
        </div>
      </div>
    );
  }

  // Nếu có nhiều ảnh, hiển thị gallery đầy đủ
  return (
    <div className="product-gallery-container">
      <div className="main-image-wrapper">
        <img 
          src={images[activeImageIndex]} 
          alt={`${name} - góc nhìn ${activeImageIndex + 1}`} 
        />
        
        <div className="gallery-indicators">
          {images.map((_, index) => (
            <div 
              key={index} 
              className={`indicator-dot ${activeImageIndex === index ? 'active' : ''}`}
              onClick={() => setActiveImageIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="thumbnails-grid">
        {images.map((img, index) => (
          <div 
            key={index} 
            className={`thumbnail-item ${activeImageIndex === index ? 'active' : ''}`}
            onClick={() => setActiveImageIndex(index)}
          >
            <img src={img} alt={`${name} ảnh nhỏ ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
