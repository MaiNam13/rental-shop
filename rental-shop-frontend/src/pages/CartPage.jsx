import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingBag, Trash2, Heart, Plus, Minus, 
  Calendar, ShieldCheck, Tag, ArrowLeft, Loader2 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import cartApi from "../api/cartApi";
import { useLanguage } from "../context/LanguageContext";
import "../styles/CartPage.css";

export default function CartPage() {
  const { isLoggedIn, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: "", onConfirm: null });

  useEffect(() => {
    if (confirmModal.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [confirmModal.isOpen]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchCartData();
    window.scrollTo(0, 0);
  }, [isLoggedIn]);

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const [cartRes, summaryRes] = await Promise.all([
        cartApi.getCart(),
        cartApi.getSummary()
      ]);
      setCartItems(cartRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, data) => {
    try {
      await cartApi.updateItem(id, data);
      fetchCartData();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const removeItem = (id) => {
    setConfirmModal({
      isOpen: true,
      message: t('confirmDelete') || 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?',
      onConfirm: async () => {
        try {
          await cartApi.removeItem(id);
          fetchCartData();
        } catch (error) {
          console.error("Failed to remove item:", error);
        }
        setConfirmModal({ isOpen: false, message: "", onConfirm: null });
      }
    });
  };

  const clearCart = () => {
    setConfirmModal({
      isOpen: true,
      message: t('confirmClearCart') || 'Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?',
      onConfirm: async () => {
        try {
          await cartApi.clearCart();
          setCartItems([]);
          setSummary(null);
        } catch (error) {
          console.error("Failed to clear cart:", error);
        }
        setConfirmModal({ isOpen: false, message: "", onConfirm: null });
      }
    });
  };

  const calculateRentalDays = (start, end) => {
    if (!start || !end) return 1;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const getProductData = (item) => {
    return item.Product || item.product || {};
  };

  const calculateItemTotal = (item) => {
    const product = getProductData(item);
    const days = calculateRentalDays(item.startDate, item.endDate);
    const price = product.price_per_day || 0;
    return price * days * item.quantity;
  };

  // Nếu API summary không khả dụng, dùng local calculation làm backup
  const subtotal = summary?.subtotal || cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  const depositFee = summary?.depositFee || subtotal * 0.2;
  const shippingFee = summary?.shippingFee || (subtotal > 0 ? 30000 : 0);
  const estimatedTotal = summary?.total || (subtotal + depositFee + shippingFee);

  if (loading) {
    return (
      <>
        <Navbar showBack={true} />
        <div className="cart-page-container flex items-center justify-center" style={{ paddingTop: '150px' }}>
          <Loader2 className="animate-spin text-gray-400" size={48} />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar showBack={true} />
      
      <div className="cart-page-container" style={{ paddingTop: '120px' }}>
        <div className="cart-content-wrapper">
          {cartItems.length === 0 ? (
            <div className="empty-cart-container">
              <div className="empty-cart-icon">
                <ShoppingBag size={40} />
              </div>
              <h2>{t('emptyCart')}</h2>
              <p>{t('emptyCartDesc')}</p>
              <Link to="/products" className="checkout-btn" style={{ display: 'inline-block', width: 'auto', padding: '16px 40px' }}>
                {t('continueShopping')}
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="cart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <h1>{t('yourCart')}</h1>
                  <p className="cart-count-info">{cartItems.length} {t('productsInCart')}</p>
                </div>
                <button 
                  onClick={clearCart}
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '13px', 
                    color: '#ef4444', 
                    background: 'none', 
                    border: '1px solid #fee2e2',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={16} /> {t('deleteAll')}
                </button>
              </div>

              <div className="cart-layout">
                {/* Left Side - Items */}
                <div className="cart-items-list">
                  {cartItems.map((item) => {
                    const product = getProductData(item);
                    return (
                      <div key={item.id} className="cart-item-card">
                        <div className="cart-item-image">
                          <Link to={`/products/${item.product_id}`} state={{ 
                            size: item.size, 
                            startDate: item.startDate, 
                            endDate: item.endDate,
                            quantity: item.quantity
                          }}>
                            <img 
                              src={product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:3000${product.image.startsWith('/') ? '' : '/uploads/'}${product.image}`) : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&q=80'} 
                              alt={product.name} 
                              onError={(e) => {
                                if (e.target.src !== 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&q=80') {
                                  e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&q=80';
                                }
                              }}
                            />
                          </Link>
                        </div>
                        
                        <div className="cart-item-details">
                          <span className="item-category">{product.Category ? t(product.Category.name) : (product.category_name ? t(product.category_name) : t('fashion'))}</span>
                          <Link to={`/products/${item.product_id}`} className="item-name">
                            {t(product.name)}
                          </Link>
                          
                          <div className="item-meta">
                            <span>{t('size')}: <strong>{item.size}</strong></span>
                          </div>

                           <div className="item-dates-row">
                            <div className="date-input-group">
                              <label>{t('startDate')}</label>
                              <input 
                                type="date" 
                                value={item.startDate} 
                                onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                                className="cart-date-input" 
                              />
                            </div>
                            <div className="date-input-group">
                              <label>{t('endDate')}</label>
                              <input 
                                type="date" 
                                value={item.endDate} 
                                onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
                                className="cart-date-input" 
                              />
                            </div>
                          </div>

                          <div className="rental-period-info">
                            <Calendar size={14} />
                            <span>{t('rentalDuration', { days: calculateRentalDays(item.startDate, item.endDate) })}</span>
                          </div>

                          <div className="cart-item-bottom">
                            <div className="quantity-controls">
                              <button 
                                className="qty-btn" 
                                onClick={() => updateItem(item.id, { quantity: item.quantity - 1 })}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="qty-value">{item.quantity}</span>
                              <button 
                                className="qty-btn" 
                                onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <div className="item-price-info">
                              <p className="price-per-day">{product.price_per_day?.toLocaleString()}đ / {t('perDay')}</p>
                              <p className="item-total-price">
                                {calculateItemTotal(item).toLocaleString()}đ
                              </p>
                            </div>

                            <div className="item-actions">
                              <button className="action-icon-btn" onClick={() => removeItem(item.id)}>
                                <Trash2 size={20} />
                              </button>
                              <button className="action-icon-btn wishlist">
                                <Heart size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Side - Summary */}
                <div className="cart-summary-sidebar">
                  <div className="order-summary-card">
                    <h2>{t('orderSummary')}</h2>
                    
                    <div className="summary-details">
                      <div className="summary-row">
                        <span>{t('subtotal')}</span>
                        <span>{subtotal.toLocaleString()}đ</span>
                      </div>
                      <div className="summary-row">
                        <span>{t('depositFee')}</span>
                        <span>{depositFee.toLocaleString()}đ</span>
                      </div>
                      <div className="summary-row">
                        <span>{t('shippingFee')}</span>
                        <span>{shippingFee.toLocaleString()}đ</span>
                      </div>

                      <div className="discount-code-section">
                        <div className="discount-input-wrapper">
                          <input 
                            type="text" 
                            placeholder={t('discountCode')}
                            className="discount-input"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                          />
                          <button className="apply-btn">{t('apply')}</button>
                        </div>
                      </div>

                      <div className="summary-row total">
                        <span>{t('totalAmount')}</span>
                        <span className="total-amount">{estimatedTotal.toLocaleString()}đ</span>
                      </div>
                    </div>

                    <button className="checkout-btn" onClick={() => navigate("/checkout")}>
                      {t('proceedToCheckout')}
                    </button>
                    
                    <button className="summary-continue-btn" onClick={() => navigate("/products")}>
                      {t('continueRental')}
                    </button>

                    <div className="trust-badges">
                      <div className="trust-item">
                        <ShieldCheck size={18} />
                        <span>{t('securePayment')}</span>
                      </div>
                      <p className="return-policy-info">
                        {t('returnPolicyNote')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Centered Luxury Confirmation Modal */}
      {confirmModal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(8, 6, 13, 0.4)', // Soft darkened luxury backdrop
          backdropFilter: 'blur(6px)', // Gorgeous glassmorphic blur
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeInModal 0.2s ease-out'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '30px 40px',
            maxWidth: '420px',
            width: '90%',
            boxShadow: '0 25px 50px rgba(8, 6, 13, 0.15)',
            textAlign: 'center',
            fontFamily: 'Montserrat, sans-serif',
            transform: 'scale(1)',
            animation: 'scaleUpModal 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#08060d',
              marginBottom: '16px',
              marginTop: 0,
              letterSpacing: '1px'
            }}>
              XÁC NHẬN
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#555555',
              lineHeight: '1.6',
              marginBottom: '28px',
              padding: '0 10px'
            }}>
              {confirmModal.message}
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button 
                onClick={() => setConfirmModal({ isOpen: false, message: "", onConfirm: null })}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '1.5px solid #e0e0e0',
                  backgroundColor: '#ffffff',
                  color: '#555555',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                HỦY
              </button>
              <button 
                onClick={confirmModal.onConfirm}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#08060d', // Pure luxury black background
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(8, 6, 13, 0.2)'
                }}
              >
                ĐỒNG Ý
              </button>
            </div>
          </div>
          <style>{`
            @keyframes fadeInModal {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleUpModal {
              from { transform: scale(0.92); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      <Footer />
    </>
  );
}
