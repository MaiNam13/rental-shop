import React, { useState, useEffect } from 'react';
import { Heart, Share2, Star, Minus, Plus, Calendar, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import axiosClient from "../../api/axiosClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProductInfo = ({ product, reviews = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { t } = useLanguage();
  
  // Lấy thông tin từ state nếu đi từ giỏ hàng sang
  const cartState = location.state || {};
  
  const [selectedSize, setSelectedSize] = useState(cartState.size || '');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(cartState.quantity || 1);
  const [startDate, setStartDate] = useState(cartState.startDate || '');
  const [endDate, setEndDate] = useState(cartState.endDate || '');
  const [activeTab, setActiveTab] = useState('description');
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [variants, setVariants] = useState([]);

  // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
  useEffect(() => {
    const checkFavorite = async () => {
      if (!isLoggedIn) return;
      try {
        const response = await axiosClient.get("/favorites");
        const found = response.data.some(fav => fav.product_id === (product.id || product._id));
        setIsFavorite(found);
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };
    checkFavorite();
  }, [product.id, product._id, isLoggedIn]);

  // Lấy danh sách biến thể
  useEffect(() => {
    const fetchData = async () => {
      const productId = product.id || product._id;
      try {
        const variantsRes = await axiosClient.get(`/product-variants/product/${productId}`);
        setVariants(variantsRes.data);
        
        // Nếu có biến thể, chọn size đầu tiên làm mặc định
        if (variantsRes.data.length > 0 && !selectedSize) {
          setSelectedSize(variantsRes.data[0].size);
        }
      } catch (error) {
        console.error("Error fetching product metadata:", error);
      }
    };
    fetchData();
  }, [product.id, product._id]);

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      await axiosClient.post("/favorites/toggle", {
        product_id: product.id || product._id
      });
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Tính số ngày thuê
  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Xóa giờ để so sánh chính xác ngày
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const duration = calculateDuration();

  const handleStartDateChange = (e) => {
    const val = e.target.value;
    setStartDate(val);
    if (endDate && new Date(val) > new Date(endDate)) {
      setEndDate('');
    }
  };

  const handleEndDateChange = (e) => {
    const val = e.target.value;
    if (startDate && new Date(val) < new Date(startDate)) {
      alert(t('endDateBeforeStartAlert'));
      setEndDate('');
      return;
    }
    setEndDate(val);
  };

  const today = new Date().toISOString().split('T')[0];

  if (!product) return null;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      alert(t('selectSizeAlert'));
      return false;
    }

    if (!selectedColor) {
      alert(t('selectColorAlert'));
      return false;
    }

    if (!startDate || !endDate) {
      alert(t('selectRentalPeriodAlert'));
      return false;
    }

    setIsAdding(true);
    try {
      await axiosClient.post("/cart", {
        product_id: product.id || product._id,
        quantity,
        size: selectedSize,
        startDate,
        endDate
      });
      alert(t('addedToCart', { name: t(product.name) }));
      return true;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert(error.response?.data?.message || "Error");
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const handleRentNow = async () => {
    const success = await handleAddToCart();
    if (success && isLoggedIn && startDate && endDate) {
      navigate("/checkout");
    }
  };

  const colors = [
    { name: t('color_black'), hex: '#000000' },
    { name: t('color_white'), hex: '#FFFFFF' },
    { name: t('color_red'), hex: '#E32636' },
    { name: t('color_blue'), hex: '#2B4A9A' }
  ];

  // Tính toán rating trung bình
  const reviewCount = reviews.length;
  const avgRating = reviewCount > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviewCount).toFixed(1)
    : 5.0;

  return (
    <div className="product-info-content">
      <div className="category-badge">{product.Category ? t(product.Category.name) : t('premiumProduct')}</div>
      
      <div className="product-header-row">
        <h1 className="product-title">{t(product.name)}</h1>
        <div className="action-buttons-top">
          <button 
            className={`icon-btn ${isFavorite ? 'favorite-active' : ''}`} 
            onClick={handleToggleFavorite}
          >
            <Heart size={20} fill={isFavorite ? "#ff4d4f" : "none"} color={isFavorite ? "#ff4d4f" : "currentColor"} />
          </button>
          <button className="icon-btn"><Share2 size={20} /></button>
        </div>
      </div>

      <div className="rating-row">
        <div className="stars">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill={i < Math.round(avgRating) ? "#000" : "none"} stroke={i < Math.round(avgRating) ? "#000" : "#ccc"} />
          ))}
        </div>
        <span className="rating-text">({avgRating})</span>
        <span className="separator-dot">•</span>
        <span className="rating-text">{t('reviewsCount', { count: reviewCount })}</span>
        <span className="separator-dot">•</span>
        <span className={`status-badge ${product.stock > 0 ? 'status-available' : 'status-unavailable'}`}>
          {product.stock > 0 ? t('inStock') : t('outOfStock')}
        </span>
      </div>

      <div className="price-section">
        <div className="price-main">
          {product.price_per_day?.toLocaleString('vi-VN')}đ <span className="price-unit">/ {t('perDay')}</span>
        </div>
        {/* Removed refundable deposit info */}
      </div>

      <p className="product-description-short">
        {product.description?.substring(0, 150) || "Trải nghiệm sự thanh lịch vượt thời gian với sản phẩm này."}...
      </p>

      {/* Size Selection */}
      <div className="selection-group">
        <label className="selection-label">{t('size')}</label>
        <div className="size-options">
          {variants.length > 0 ? (
            variants.map(v => (
              <button 
                key={v.id}
                className={`size-btn ${selectedSize === v.size ? 'active' : ''}`}
                onClick={() => setSelectedSize(v.size)}
              >
                {v.size}
              </button>
            ))
          ) : (
            ['XS', 'S', 'M', 'L', 'XL'].map(size => (
              <button 
                key={size}
                className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Color Selection */}
      <div className="selection-group">
        <label className="selection-label">{t('color')}</label>
        <div className="color-options">
          {colors.map(color => (
            <div 
              key={color.name}
              className={`color-circle-wrapper ${selectedColor === color.name ? 'active' : ''}`}
              onClick={() => setSelectedColor(color.name)}
            >
              <div className="color-circle" style={{ backgroundColor: color.hex }}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Quantity Selection */}
      <div className="selection-group">
        <label className="selection-label">{t('quantity')}</label>
        <div className="quantity-picker">
          <button className="qty-control-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            <Minus size={16} />
          </button>
          <div className="qty-value-display">{quantity}</div>
          <button className="qty-control-btn" onClick={() => setQuantity(quantity + 1)}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Rental Period Selection */}
      <div className="selection-group">
        <label className="selection-label">{t('rentalPeriod')}</label>
        <div className="rental-period-premium">
          <div className="date-box">
            <div className="date-input-field">
              <Calendar size={18} />
              <input 
                type="date" 
                value={startDate}
                min={today}
                onChange={handleStartDateChange}
                placeholder={t('startDate')}
              />
            </div>
          </div>
          
          <div className="date-box">
            <div className="date-input-field">
              <Calendar size={18} />
              <input 
                type="date" 
                value={endDate}
                min={startDate || today}
                onChange={handleEndDateChange}
                placeholder={t('endDate')}
              />
            </div>
          </div>
        </div>
        
        {duration > 0 && (
          <>
            <div className="duration-badge">
              <Clock size={14} />
              <span>{t('total')} <strong>{duration} {t('days')}</strong></span>
            </div>

            <div className="price-summary-card">
              <h3 className="summary-title">{t('priceSummary')}</h3>
              
              <div className="summary-row">
                <span>{t('pricePerDay')}</span>
                <span>{product.price_per_day?.toLocaleString('vi-VN')}đ</span>
              </div>
              
              <div className="summary-row">
                <span>{t('totalRentalFee', { days: duration, quantity })}</span>
                <span>{(product.price_per_day * duration * quantity).toLocaleString('vi-VN')}đ</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>{t('totalEstimated')}</span>
                <span className="total-amount">
                  {(product.price_per_day * duration * quantity).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Actions */}
      <div className="main-actions-stack">
        <button 
          className="btn-primary-dark" 
          onClick={handleRentNow} 
          disabled={isAdding || product.stock <= 0}
        >
          {product.stock > 0 ? t('rentNowUpper') : t('outOfStock')}
        </button>
        <button 
          className="btn-outline-dark" 
          onClick={handleAddToCart} 
          disabled={isAdding || product.stock <= 0}
        >
          {isAdding ? t('submitting') : product.stock > 0 ? t('addToCart') : t('notAvailable')}
        </button>
      </div>

      <div className="safety-policy-brief" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '12px', fontSize: '13px', color: '#666' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Clock size={16} color="#28a745" />
          <span style={{ fontWeight: '600', color: '#08060d' }}>{t('safetyPolicy')}</span>
        </div>
        <p style={{ margin: 0 }}>{t('safetyPolicyDesc')}</p>
      </div>
    </div>
  );
};

export default ProductInfo;
