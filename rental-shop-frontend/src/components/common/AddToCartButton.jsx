import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { Loader2, ShoppingBag } from 'lucide-react';

const AddToCartButton = ({ product, size, startDate, endDate, quantity }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      const confirmLogin = window.confirm("Bạn cần đăng nhập để thực hiện hành động này. Chuyển đến trang đăng nhập?");
      if (confirmLogin) {
        navigate('/login');
      }
      return;
    }

    if (!startDate || !endDate) {
      alert("Vui lòng chọn ngày bắt đầu và kết thúc thuê đồ.");
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
        if (window.confirm("Đã thêm vào giỏ hàng thành công! Bạn có muốn đi đến giỏ hàng không?")) {
          navigate('/cart');
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
      {product?.stock <= 0 ? 'HẾT HÀNG' : (loading ? 'ĐANG XỬ LÝ...' : 'THÊM VÀO GIỎ HÀNG')}
    </button>
  );
};

export default AddToCartButton;
