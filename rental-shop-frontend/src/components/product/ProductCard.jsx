import { Star, ShoppingCart, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import favoriteApi from '../../api/favoriteApi'

const ProductCard = ({ product, isFavoriteInitial = false }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isLoggedIn } = useAuth();
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);
  const [loading, setLoading] = useState(false);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    try {
      await favoriteApi.toggleFavorite(product.id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luxe-product-card" onClick={() => navigate(`/products/${product.id}`)} style={{ cursor: 'pointer' }}>
      <div className="luxe-card-image-wrapper">
        <img 
          src={product.image} 
          alt={product.name}
          className="luxe-product-image"
        />
        {product.badge && (
          <span className="hot-badge">{product.badge.toUpperCase()}</span>
        )}
        <button 
          className={`wishlist-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleToggleFavorite}
          disabled={loading}
          aria-label={isFavorite ? t('removeFromWishlist') : t('addToWishlist')}
        >
          <Heart size={20} fill={isFavorite ? "#ef4444" : "none"} color={isFavorite ? "#ef4444" : "#fff"} />
        </button>
      </div>
      
      <div className="luxe-product-info">
        <span className="luxe-category">{t(product.category)}</span>
        <h3 className="luxe-name" style={{ marginTop: '0' }}>{t(product.name)}</h3>
        
        <div className="luxe-rating-row">
          <div className="stars-row">
            {[1, 2, 3, 4, 5].map(s => (
              <Star 
                key={s} 
                size={12} 
                fill={s <= 5 ? "#000" : "none"} 
                color={s <= 5 ? "#000" : "#ccc"} 
              />
            ))}
          </div>
          <span className="rating-text">(5.0)</span>
        </div>

        <div className="luxe-price-status-row">
          <div className="luxe-price">
            {product.price}<span className="price-unit">/{t('perDay')}</span>
          </div>
          <div className={`luxe-status ${product.stock > 0 ? 'status-available' : 'status-unavailable'}`}>
            {product.stock > 0 ? t('inStock') : t('outOfStock')}
          </div>
        </div>

        <div className="luxe-card-actions">
          <button className="action-rent-btn" onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.id}`); }}>{t('rentNowUpper')}</button>
          <button className="action-cart-btn" onClick={(e) => { e.stopPropagation(); alert(t('addedToCart', { name: t(product.name) })); }}><ShoppingCart size={18} /></button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
