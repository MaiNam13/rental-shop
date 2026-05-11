import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import RelatedProducts from '../components/product/RelatedProducts';
import { getProductById } from '../api/productApi';
import '../styles/ProductDetail.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const fetchReviews = async () => {
    try {
      const res = await axiosClient.get(`/reviews/product/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(id);
        if (productData) {
          setProduct(productData);
        }
        await fetchReviews();
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return alert(t('enterReviewContent'));
    
    setIsSubmittingReview(true);
    try {
      await axiosClient.post('/reviews', {
        product_id: product.id || product._id,
        rating: newRating,
        comment: newComment
      });
      setNewComment('');
      setNewRating(5);
      await fetchReviews();
      alert(t('thankYouReview'));
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert(err.response?.data?.message || t('error'));
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '200px 0', textAlign: 'center' }}>
            <div className="container">{t('productLoading')}</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '200px 0', textAlign: 'center' }}>
            <div className="container">{t('productNotFound')}</div>
        </div>
        <Footer />
      </>
    );
  }

  // Chuẩn hóa đường dẫn ảnh
  const getFullImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop&q=80';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `http://localhost:3000${path}`;
    return `http://localhost:3000/uploads/${path}`;
  };

  // Tạo mảng ảnh để truyền vào Gallery
  let productImages = [];
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    productImages = product.images.map(img => getFullImageUrl(img));
  } else if (product.image) {
    productImages = [getFullImageUrl(product.image)];
  }

  return (
    <>
      <Navbar />
      <main className="product-detail-page" style={{ paddingTop: '100px' }}>
        <div className="product-detail-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            <span>{t('back')}</span>
          </button>
          
          <div className="product-main-layout">
            <div className="gallery-column">
              <ProductGallery images={productImages} name={product.name} />
              
              {/* Moved Tabs under gallery */}
              <div className="product-tabs-container" style={{ marginTop: '20px' }}>
                <div 
                  className={`tab-item ${activeTab === 'description' ? 'active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  {t('description')}
                </div>
                <div 
                  className={`tab-item ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  {t('reviewsCount', { count: reviews.length })}
                </div>
                <div 
                  className={`tab-item ${activeTab === 'policy' ? 'active' : ''}`}
                  onClick={() => setActiveTab('policy')}
                >
                  {t('policy')}
                </div>
              </div>

              <div className="tab-content-area" style={{ padding: '0' }}>
                {activeTab === 'description' && (
                  <div className="tab-description" style={{ paddingTop: '20px' }}>
                    <p style={{ lineHeight: '1.8', color: '#555' }}>
                      {product.description || t('noDescription')}
                    </p>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="tab-reviews" style={{ paddingTop: '0', marginTop: '-25px' }}>
                    {/* Form gửi đánh giá mới */}
                    <div className="review-form-container" style={{ marginBottom: '20px', padding: '15px 25px 25px', backgroundColor: '#fcfcfc', borderRadius: '16px', border: '1px solid #f0f0f0' }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>{t('writeReview')}</h4>
                      
                      <div className="rating-selector" style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#666', marginRight: '10px' }}>{t('productQuality')}</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={24} 
                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                            fill={(hoverRating || newRating) >= star ? "#000" : "none"} 
                            stroke={(hoverRating || newRating) >= star ? "#000" : "#ccc"}
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                          />
                        ))}
                        <span style={{ marginLeft: '10px', fontWeight: '600', color: '#000' }}>
                          {newRating === 5 ? t('excellent') : newRating === 4 ? t('veryGood') : newRating === 3 ? t('normal') : newRating === 2 ? t('poor') : t('veryPoor')}
                        </span>
                      </div>

                      <form onSubmit={handleReviewSubmit}>
                        <textarea 
                          placeholder={t('shareExperience')}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          style={{ 
                            width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #eee', 
                            minHeight: '120px', fontSize: '14px', marginBottom: '15px', outline: 'none',
                            backgroundColor: 'white', transition: 'border-color 0.3s'
                          }}
                        />
                        <button 
                          type="submit" 
                          disabled={isSubmittingReview}
                          className="btn-primary-dark"
                          style={{ width: 'auto', padding: '12px 30px', fontSize: '14px' }}
                        >
                          {isSubmittingReview ? t('submitting') : t('submitReview')}
                        </button>
                      </form>
                    </div>

                    <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>{t('customerReviews', { count: reviews.length })}</h4>
                    {reviews.length > 0 ? (
                      reviews.map(review => (
                        <div key={review.id} className="review-item" style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #f5f5f5' }}>
                          <div style={{ display: 'flex', gap: '15px' }}>
                            {/* Avatar */}
                            <div className="review-avatar" style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#eee', flexShrink: 0, overflow: 'hidden' }}>
                              <img 
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.User?.name || "K")}&background=random&color=fff`} 
                                alt="" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                            
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                  <div style={{ fontWeight: '600', fontSize: '15px', color: '#08060d', marginBottom: '4px' }}>
                                    {review.User?.name || t('customer')}
                                  </div>
                                  <div style={{ color: '#000', display: 'flex', gap: '2px', marginBottom: '12px' }}>
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} size={14} fill={i < review.rating ? "#000" : "none"} stroke={i < review.rating ? "#000" : "#ccc"} />
                                    ))}
                                  </div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#999' }}>
                                  {new Date(review.createdAt).toLocaleDateString(t('dateFormat'), { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                              </div>
                              <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: '#999' }}>{t('noProductReviews')}</p>
                    )}
                  </div>
                )}
                {activeTab === 'policy' && (
                  <div className="tab-policy">
                    <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '2', color: '#555' }}>
                      <li>{t('policy1')}</li>
                      <li>{t('policy2')}</li>
                      <li>{t('policy3')}</li>
                      <li>{t('policy4')}</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <ProductInfo product={product} reviews={reviews} />
          </div>

          <RelatedProducts
            currentProductId={product.id || product._id}
            categoryId={product.category_id}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetailPage;