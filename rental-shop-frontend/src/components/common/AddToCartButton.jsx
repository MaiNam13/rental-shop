import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Loader2, ShoppingBag } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

const AddToCartButton = ({ product, size, startDate, endDate, quantity }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: "", onConfirm: null });
  const { toast } = useToast();

  useEffect(() => {
    if (confirmModal.isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [confirmModal.isOpen]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setConfirmModal({
        isOpen: true,
        message: t('loginPrompt'),
        onConfirm: () => {
          navigate('/login');
          setConfirmModal({ isOpen: false, message: "", onConfirm: null });
        }
      });
      return;
    }

    if (!startDate || !endDate) {
      toast(t('selectDatesPrompt'), "error");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post('/cart', {
        product_id: product.id || product._id,
        quantity: quantity || 1,
        size: size || 'M',
        startDate,
        endDate
      });

      if (response.status === 201) {
        setConfirmModal({
          isOpen: true,
          message: t('addedToCartPrompt'),
          onConfirm: () => {
            navigate('/cart');
            setConfirmModal({ isOpen: false, message: "", onConfirm: null });
          }
        });
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast(error.response?.data?.message || t('addToCartError'), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleAddToCart}
        disabled={loading || product?.stock <= 0}
        className="add-to-cart-btn"
        style={{
          width: '100%',
          padding: '16px',
          background: 'var(--color-text-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: (loading || product?.stock <= 0) ? 'not-allowed' : 'pointer',
          marginTop: '20px',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          opacity: (loading || product?.stock <= 0) ? 0.7 : 1
        }}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <ShoppingBag size={20} />
        )}
        {product?.stock <= 0 ? t('outOfStock') : (loading ? t('processing') : t('addToCartButtonText'))}
      </button>
        
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
              {t('notification')}
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
                {t('cancelUpper')}
              </button>
              <button 
                onClick={confirmModal.onConfirm}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#08060d', // Gold/Dark theme confirm
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(8, 6, 13, 0.2)'
                }}
              >
                {t('confirmUpper')}
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
    </>
  );
};

export default AddToCartButton;
