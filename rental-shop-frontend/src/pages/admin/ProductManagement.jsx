import React, { useState, useEffect } from 'react';
import { 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  CalendarRange, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Edit2, 
  Trash2, 
  X,
  Upload,
  Star,
  Tags,
  Warehouse,
  BarChart3,
  ChevronDown
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import '../../styles/AdminDashboard.css';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_per_day: '',
    category_id: '',
    stock: '',
    status: 'available',
    sizes: [],
    colors: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];
  const availableColors = ['Đen', 'Trắng', 'Trắng ngà', 'Champagne', 'Đỏ', 'Navy', 'Nude', 'Xanh lá', 'Caramel', 'Hồng nhạt', 'Rouge', 'Xám than'];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosClient.get('/admin/products'),
        axiosClient.get('/categories')
      ]);
      setProducts(prodRes.data.products);
      setSummary(prodRes.data.summary);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Error fetching admin products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category_id === parseInt(selectedCategory);
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'price-low') return a.price_per_day - b.price_per_day;
    if (sortBy === 'price-high') return b.price_per_day - a.price_per_day;
    return 0;
  });

  const removeFilter = (type) => {
    if (type === 'category') setSelectedCategory('all');
    if (type === 'status') setSelectedStatus('all');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleToggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size) 
        : [...prev.sizes, size]
    }));
  };

  const handleToggleColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color) 
        ? prev.colors.filter(c => c !== color) 
        : [...prev.colors, color]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price_per_day', formData.price_per_day);
    data.append('category_id', formData.category_id);
    data.append('stock', formData.stock);
    data.append('status', formData.status);
    // For now we'll just send sizes/colors as strings if backend doesn't support variants yet
    data.append('features', JSON.stringify({ sizes: formData.sizes, colors: formData.colors }));
    
    if (selectedImage) {
      data.append('image', selectedImage);
    }

    try {
      await axiosClient.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowModal(false);
      fetchData(); // Refresh list
      // Reset form
      setFormData({
        name: '', description: '', price_per_day: '', category_id: '', stock: '', status: 'available', sizes: [], colors: ''
      });
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      alert("Lỗi khi thêm sản phẩm: " + error.message);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải danh sách sản phẩm...</div>;

  return (
    <div className="product-management-page">
      <div className="page-header">
        <div className="header-breadcrumbs">
          <span>Tổng quan</span>
          <span>›</span>
          <span className="active">Sản phẩm</span>
        </div>
        
        <div className="header-main">
          <div className="header-title">
            <h2>Quản lý sản phẩm</h2>
            <p>Quản lý danh mục sản phẩm cho thuê thời trang cao cấp</p>
          </div>
          <div className="header-actions">
            <button className="export-btn">
              <Download size={18} />
              <span>Xuất file</span>
            </button>
            <button 
              className="add-new-btn" 
              onClick={() => setShowModal(true)}
            >
              <Plus size={18} />
              <span>Thêm sản phẩm</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
        <div className="stat-card" style={{ border: '1.5px solid #ccc' }}>
          <div className="stat-icon"><Package size={20} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div className="stat-value">{summary?.total || 0}</div>
              <div className="stat-label">Tổng sản phẩm</div>
            </div>
            <div style={{ fontSize: 10, color: '#888' }}>Tất cả danh mục</div>
          </div>
        </div>
        <div className="stat-card" style={{ border: '1.5px solid #ccc' }}>
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#22c55e' }}><CheckCircle2 size={20} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div className="stat-value">{summary?.available || 0}</div>
              <div className="stat-label">Có sẵn</div>
            </div>
            <div style={{ fontSize: 10, color: '#888' }}>Sẵn sàng cho thuê</div>
          </div>
        </div>
        <div className="stat-card" style={{ border: '1.5px solid #ccc' }}>
          <div className="stat-icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}><AlertTriangle size={20} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div className="stat-value">{summary?.outOfStock || 0}</div>
              <div className="stat-label">Hết hàng</div>
            </div>
            <div style={{ fontSize: 10, color: '#888' }}>Cần nhập thêm</div>
          </div>
        </div>
        <div className="stat-card" style={{ border: '1.5px solid #ccc' }}>
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}><CalendarRange size={20} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div className="stat-value">{summary?.renting || 0}</div>
              <div className="stat-label">Đang cho thuê</div>
            </div>
            <div style={{ fontSize: 10, color: '#888' }}>Hiện đang thuê</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-card">
        <div className="filter-row">
          {/* Left Side: Search Box */}
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Right Side: Filters */}
          <div className="filters-right">
            {/* Category Dropdown */}
            <div className="filter-select-group">
              <Tags size={16} className="filter-icon-left" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <ChevronDown size={14} className="filter-icon-right" />
            </div>

            {/* Status Dropdown */}
            <div className="filter-select-group">
              <Warehouse size={16} className="filter-icon-left" />
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="available">Có sẵn</option>
                <option value="out_of_stock">Hết hàng</option>
                <option value="hidden">Ẩn</option>
              </select>
              <ChevronDown size={14} className="filter-icon-right" />
            </div>

            {/* Sort Dropdown */}
            <div className="filter-select-group">
              <BarChart3 size={16} className="filter-icon-left" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-low">Giá: Thấp đến Cao</option>
                <option value="price-high">Giá: Cao đến Thấp</option>
              </select>
              <ChevronDown size={14} className="filter-icon-right" />
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="active-filters-bar">
          <div className="active-filters-list">
            <span className="filter-label">Đang lọc:</span>
            <div className="badges-container">
              {selectedCategory !== 'all' && (
                <div className="filter-badge">
                  {categories.find(c => c.id === parseInt(selectedCategory))?.name} 
                  <span onClick={() => removeFilter('category')} className="remove-filter">×</span>
                </div>
              )}
              {selectedStatus !== 'all' && (
                <div className="filter-badge">
                  {selectedStatus === 'available' ? 'Có sẵn' : selectedStatus === 'out_of_stock' ? 'Hết hàng' : 'Ẩn'} 
                  <span onClick={() => removeFilter('status')} className="remove-filter">×</span>
                </div>
              )}
              {searchTerm && (
                <div className="filter-badge">
                  "{searchTerm}" 
                  <span onClick={() => setSearchTerm('')} className="remove-filter">×</span>
                </div>
              )}
              {selectedCategory === 'all' && selectedStatus === 'all' && !searchTerm && (
                <span className="no-filters">Chưa áp dụng bộ lọc</span>
              )}
            </div>
          </div>
          {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchTerm) && (
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSearchTerm('');
              }}
              className="clear-all-btn"
            >
              Xoá tất cả
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="data-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}><input type="checkbox" /></th>
              <th>SẢN PHẨM</th>
              <th>DANH MỤC</th>
              <th>GIÁ / NGÀY</th>
              <th>TỒN KHO</th>
              <th>TRẠNG THÁI</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
              <tr key={product.id}>
                <td><input type="checkbox" /></td>
                <td>
                  <div className="product-info-cell">
                    <img 
                      src={product.image ? `http://localhost:3000${product.image}` : 'https://via.placeholder.com/50'} 
                      alt={product.name} 
                      className="product-img-small"
                    />
                    <div>
                      <div className="product-name-text">{product.name}</div>
                      <div className="product-rating-row">
                        <Star size={10} fill="#c5a059" /> 
                        <Star size={10} fill="#c5a059" /> 
                        <Star size={10} fill="#c5a059" /> 
                        <Star size={10} fill="#c5a059" /> 
                        <Star size={10} stroke="#c5a059" />
                        <span className="rating-count">{product.rating || 5.0} · {Math.floor(Math.random() * 50)} lượt</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td><span className="category-badge">{product.Category?.name || 'N/A'}</span></td>
                <td className="price-text">{product.price_per_day?.toLocaleString()}₫</td>
                <td>
                  <div className="stock-container">
                    <div className="stock-bar-bg">
                      <div className="stock-bar-fill" style={{ width: `${Math.min((product.stock / 10) * 100, 100)}%`, backgroundColor: product.stock > 0 ? '#22c55e' : '#ef4444' }}></div>
                    </div>
                    <span className="stock-value">{product.stock}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${product.status === 'available' ? 'status-confirmed' : product.status === 'out_of_stock' ? 'status-overdue' : 'status-pending'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <div className="status-dot" style={{ backgroundColor: product.status === 'available' ? '#22c55e' : product.status === 'out_of_stock' ? '#ef4444' : '#f97316' }}></div>
                    {product.status === 'available' ? 'Có sẵn' : product.status === 'out_of_stock' ? 'Hết hàng' : 'Nháp'}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="action-icon"><Eye size={16} /></button>
                    <button className="action-icon"><Edit2 size={16} /></button>
                    <button className="action-icon" style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  Không tìm thấy sản phẩm nào khớp với bộ lọc
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Thêm sản phẩm mới</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  {/* Left Column */}
                  <div className="form-section">
                    <div className="form-group">
                      <label className="form-label">HÌNH ẢNH SẢN PHẨM *</label>
                      <div className="image-upload-zone" onClick={() => document.getElementById('image-upload').click()}>
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="preview-img" />
                        ) : (
                          <div className="upload-placeholder">
                            <Upload size={32} />
                            <span>Nhấp để tải lên hình ảnh</span>
                          </div>
                        )}
                        <input id="image-upload" type="file" hidden onChange={handleImageChange} accept="image/*" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">TÊN SẢN PHẨM *</label>
                      <input 
                        type="text" 
                        placeholder="VD: Đầm Cưới Couture Valentino" 
                        className="form-input"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">MÔ TẢ</label>
                      <textarea 
                        placeholder="Mô tả chi tiết về sản phẩm..." 
                        className="form-textarea"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">MÀU SẮC</label>
                      <input 
                        type="text" 
                        placeholder="VD: Đen, Trắng, Nude..." 
                        className="form-input"
                        value={formData.colors}
                        onChange={(e) => setFormData({...formData, colors: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="form-section">
                    <div className="form-group">
                      <label className="form-label">DANH MỤC *</label>
                      <select 
                        className="form-select"
                        required
                        value={formData.category_id}
                        onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">GIÁ / NGÀY *</label>
                        <input 
                          type="number" 
                          placeholder="0" 
                          min="0"
                          className="form-input"
                          required
                          value={formData.price_per_day}
                          onChange={(e) => setFormData({...formData, price_per_day: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">TỒN KHO</label>
                        <input 
                          type="number" 
                          placeholder="0" 
                          min="0"
                          className="form-input"
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">TRẠNG THÁI</label>
                      <div className="status-grid">
                        {['available', 'outOfStock', 'hidden'].map(status => (
                          <label key={status} className={`status-option ${formData.status === status ? `active ${status}` : ''}`}>
                            <input 
                              type="radio" 
                              name="status" 
                              value={status} 
                              checked={formData.status === status}
                              onChange={(e) => setFormData({...formData, status: e.target.value})}
                              hidden
                            />
                            <span style={{ fontSize: 13 }}>
                              {status === 'available' ? 'Có sẵn' : status === 'outOfStock' ? 'Hết hàng' : 'Ẩn'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">KÍCH CỠ</label>
                      <div className="options-flex">
                        {availableSizes.map(size => (
                          <button 
                            key={size} 
                            type="button"
                            onClick={() => handleToggleSize(size)}
                            className={`option-btn size-btn ${formData.sizes.includes(size) ? 'selected' : ''}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="note-box" style={{ marginTop: 24 }}>
                  <p className="note-title">Lưu ý</p>
                  <p className="note-text">Sản phẩm sẽ được kiểm tra trước khi hiển thị công khai. Thời gian xét duyệt 1-2 ngày làm việc.</p>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Huỷ bỏ
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                >
                  Lưu nháp
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                >
                  Tạo sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
