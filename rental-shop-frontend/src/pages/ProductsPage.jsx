import React, { useState, useEffect } from 'react';
import { Search, Star, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { getProducts, getCategories } from '../api/productApi';
import { useLanguage } from '../context/LanguageContext';
import '../styles/ProductsPage.css';

const ProductsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState('Newest');
  const [maxPrice, setMaxPrice] = useState(10000000); // 10M default
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(8); 
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fix screen jump by scrolling to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (data) setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let apiSort = 'DESC';
        if (sortOption === t('priceLowHigh')) apiSort = 'ASC';
        if (sortOption === t('priceHighLow')) apiSort = 'DESC';

        const params = { 
          page, 
          limit, 
          sort: apiSort,
          minPrice: 0,
          maxPrice: maxPrice,
          status: statusFilter
        };
        if (keyword.trim()) params.keyword = keyword.trim();
        if (selectedCategory !== 'all') params.category = selectedCategory;

        const data = await getProducts(params);
        if (data && data.products) {
          setProducts(data.products);
          setTotalPages(data.totalPages || 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timeoutId);
  }, [keyword, selectedCategory, sortOption, maxPrice, statusFilter, page, limit]);

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('all');
    setSortOption('Newest');
    setMaxPrice(10000000);
    setStatusFilter('all');
    setPage(1);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    alert(t('addedToCart', { name: product.name }));
  };

  const handleRentNow = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  const getProductImage = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop&q=80';
    if (image.startsWith('http')) return image;
    return `http://localhost:3000${image.startsWith('/') ? '' : '/uploads/'}${image}`;
  };

  return (
    <>
      <Navbar />
      <main className="products-page" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="container">
          <div className="products-banner">
            <h1>{t('fashionCollection')}</h1>
            <p>{t('rentForOccasions')}</p>
            <button className="explore-btn">{t('exploreNow')}</button>
          </div>

          <div className="search-sort-bar">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
              />
            </div>
            <select 
              className="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="Newest">{t('newest')}</option>
              <option value={t('priceLowHigh')}>{t('priceLowHigh')}</option>
              <option value={t('priceHighLow')}>{t('priceHighLow')}</option>
            </select>
          </div>

          <div className="products-layout">
            <aside className="products-sidebar">
              <div className="filter-section">
                <h3 className="filter-title">{t('categories')}</h3>
                <div className="category-list">
                  <button 
                    className={`category-btn ${String(selectedCategory) === 'all' ? 'active' : ''}`}
                    onClick={() => { setSelectedCategory('all'); setPage(1); }}
                  >
                    {t('all')}
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat.id}
                      className={`category-btn ${String(selectedCategory) === String(cat.id) ? 'active' : ''}`}
                      onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                    >
                      {t(cat.name)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">{t('priceRange')}</h3>
                <div className="price-range-slider">
                  <input 
                    type="range" 
                    min="0" 
                    max="10000000" 
                    step="500000"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(parseInt(e.target.value)); setPage(1); }}
                    style={{ width: '100%', accentColor: '#000' }} 
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '10px' }}>
                    <span>0đ</span>
                    <span>{maxPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">{t('status')}</h3>
                <div className="category-list">
                  <button 
                    className={`category-btn ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => { setStatusFilter('all'); setPage(1); }}
                  >
                    {t('all')}
                  </button>
                  <button 
                    className={`category-btn ${statusFilter === 'available' ? 'active' : ''}`}
                    onClick={() => { setStatusFilter('available'); setPage(1); }}
                  >
                    {t('inStock')}
                  </button>
                  <button 
                    className={`category-btn ${statusFilter === 'out_of_stock' ? 'active' : ''}`}
                    onClick={() => { setStatusFilter('out_of_stock'); setPage(1); }}
                  >
                    {t('outOfStock')}
                  </button>
                  <button 
                    className={`category-btn ${statusFilter === 'hidden' ? 'active' : ''}`}
                    onClick={() => { setStatusFilter('hidden'); setPage(1); }}
                  >
                    Đã ẩn
                  </button>
                </div>
              </div>

              <button className="reset-filters-btn" onClick={handleResetFilters}>{t('resetFilters')}</button>
            </aside>

            <div className="products-main">
              <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
                {t('showing')} <strong>{products.length}</strong> {t('productsLabel')}
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>{t('loadingCollection')}</div>
              ) : (
                <div className="products-grid">
                  {products.map((product) => (
                    <div key={product.id} className={`luxe-product-card ${product.status === 'hidden' ? 'product-ghosted' : ''}`} onClick={() => product.status !== 'hidden' && navigate(`/products/${product.id}`)} style={{ cursor: product.status === 'hidden' ? 'not-allowed' : 'pointer' }}>
                      <div className="luxe-card-image-wrapper">
                        <img 
                          src={getProductImage(product.image)} 
                          alt={product.name} 
                          className="luxe-product-image"
                        />
                        <div className="hot-badge">HOT</div>
                      </div>
                      
                      <div className="luxe-product-info">
                        <div className="luxe-category">{product.Category ? t(product.Category.name) : t('products')}</div>
                        <h3 className="luxe-name">{t(product.name)}</h3>
                        
                        <div className="luxe-rating-row">
                          <div className="stars-row">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star 
                                key={s} 
                                size={12} 
                                fill={s <= Math.round(product.rating || 5) ? "#000" : "none"} 
                                color={s <= Math.round(product.rating || 5) ? "#000" : "#ccc"} 
                              />
                            ))}
                          </div>
                          <span className="rating-text">({(product.rating || 5.0).toFixed(1)})</span>
                        </div>

                        <div className="luxe-price-status-row">
                          <div className="luxe-price">
                            {product.price_per_day?.toLocaleString('vi-VN')}đ<span className="price-unit">/ngày</span>
                          </div>
                          <div className={`luxe-status ${product.status === 'available' && product.stock > 0 ? 'status-available' : product.status === 'hidden' ? 'status-hidden' : 'status-unavailable'}`}>
                            {product.status === 'available' && product.stock > 0 ? t('inStock') : product.status === 'hidden' ? 'Đã ẩn' : t('outOfStock')}
                          </div>
                        </div>

                        <div className="luxe-card-actions">
                          <button 
                            className="action-rent-btn" 
                            onClick={(e) => handleRentNow(e, product)}
                            disabled={product.status !== 'available' || product.stock <= 0}
                          >
                            {product.status === 'available' && product.stock > 0 ? t('rentNowUpper') : product.status === 'hidden' ? 'ĐÃ ẨN' : t('outOfStock')}
                          </button>
                          <button 
                            className="action-cart-btn" 
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={product.status !== 'available' || product.stock <= 0}
                          >
                            <ShoppingCart size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="luxe-pagination">
                  <button 
                    className="page-btn" 
                    disabled={page === 1}
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i + 1} 
                      className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    className="page-btn" 
                    disabled={page === totalPages}
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductsPage;
