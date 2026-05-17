import React, { useState, useEffect } from 'react';
import { 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  CalendarRange, 
  Download, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Upload,
  Star,
  Tags,
  Warehouse,
  ChevronDown
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../context/ToastContext';
import './ProductManagement.css';

const LuxeSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className={`luxe-select-container ${isOpen ? 'open' : ''}`}>
      <div className="luxe-select-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown size={16} className="luxe-select-icon" />
      </div>
      
      {isOpen && (
        <>
          <div className="luxe-select-overlay" onClick={() => setIsOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999 }} />
          <div className="luxe-select-dropdown">
            <div className="luxe-select-options">
              {options.map((option) => (
                <div 
                  key={option.value} 
                  className={`luxe-select-option ${value === option.value ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                  {value === option.value && <CheckCircle2 size={14} className="check-icon" />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

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

  const [formData, setFormData] = useState({
    name: '', description: '', price_per_day: '', category_id: '', stock: '', status: 'available', sizes: [], colors: []
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: "", onConfirm: null });
  const { toast } = useToast();

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];
  const availableColors = [
    { name: 'Đen', hex: '#000000' },
    { name: 'Trắng', hex: '#FFFFFF' },
    { name: 'Đỏ', hex: '#E32636' },
    { name: 'Xanh dương', hex: '#2B4A9A' },
    { name: 'Xanh lá', hex: '#22c55e' },
    { name: 'Vàng', hex: '#FFD700' },
    { name: 'Hồng', hex: '#FF69B4' },
    { name: 'Be', hex: '#F5F5DC' },
    { name: 'Xám', hex: '#808080' },
    { name: 'Nâu', hex: '#8B4513' },
    { name: 'Tím', hex: '#800080' },
    { name: 'Cam', hex: '#FFA500' }
  ];
  const statusOptions = [
    { id: 'available', label: 'Có sẵn' },
    { id: 'out_of_stock', label: 'Hết hàng' },
    { id: 'renting', label: 'Đang thuê' }
  ];

  const getStatusInfo = (status) => statusOptions.find(o => o.id === status) || statusOptions[2];

  useEffect(() => { fetchData(); }, []);

  // Ultimate Scroll Lock Effect
  useEffect(() => {
    if (showModal || confirmModal.isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (showModal) document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    };
  }, [showModal, confirmModal.isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosClient.get('/admin/products'),
        axiosClient.get('/categories')
      ]);
      setProducts(prodRes.data.products || []);
      setSummary(prodRes.data.summary || null);
      setCategories(catRes.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast('Không thể tải dữ liệu sản phẩm', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setFormData(prev => ({
      ...prev, stock: val, 
      status: val === 0 ? 'out_of_stock' : (prev.status === 'out_of_stock' ? 'available' : prev.status)
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'sizes') data.append('features', JSON.stringify({ sizes: formData.sizes, colors: formData.colors }));
      else if (key !== 'colors') data.append(key, formData[key]);
    });
    if (parseInt(formData.stock) === 0) data.set('status', 'out_of_stock');
    if (selectedImage) data.append('image', selectedImage);

    try {
      if (editMode) await axiosClient.put(`/products/${currentId}`, data);
      else await axiosClient.post('/products', data);
      toast(editMode ? 'Cập nhật thành công' : 'Thêm mới thành công');
      setShowModal(false);
      await fetchData();
      resetForm();
    } catch (error) { 
      console.error("Save error:", error);
      toast('Lỗi khi lưu sản phẩm', 'error');
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      message: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      onConfirm: async () => {
        try { 
          await axiosClient.delete(`/products/${id}`); 
          toast('Đã xóa sản phẩm');
          fetchData(); 
        } catch (error) { 
          console.error("Delete error:", error);
          toast('Không thể xóa sản phẩm', 'error');
        }
        setConfirmModal({ isOpen: false, message: "", onConfirm: null });
      }
    });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price_per_day: '', category_id: '', stock: '', status: 'available', sizes: [], colors: [] });
    setSelectedImage(null); setImagePreview(null); setEditMode(false); setIsViewOnly(false); setCurrentId(null);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category_id === parseInt(selectedCategory);
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'price-low') return a.price_per_day - b.price_per_day;
    if (sortBy === 'price-high') return b.price_per_day - a.price_per_day;
    return 0;
  });

  return (
    <div className="product-management-page">
      <style>{`
        body.modal-open, html.modal-open {
          overflow: hidden !important;
          height: 100vh !important;
        }
        body.modal-open *::-webkit-scrollbar,
        html.modal-open *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        body.modal-open *,
        html.modal-open * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .modal-content-luxe {
          overflow-x: hidden !important;
        }
      `}</style>
      <div className="page-header-main">
        <div className="header-title">
          <h2>Quản lý sản phẩm</h2>
          <p>Quản lý danh mục sản phẩm cho thuê thời trang cao cấp</p>
        </div>
        <div className="header-actions">
          <button className="export-btn"><Download size={18} /> Xuất file</button>
          <button className="add-new-btn" onClick={() => { resetForm(); setShowModal(true); }}><Plus size={18} /> Thêm sản phẩm</button>
        </div>
      </div>

      <div className="product-stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Package size={22} /></div>
          <div className="stat-card-details">
            <div className="stat-value">{summary?.total || 0}</div>
            <div className="stat-label">Tổng sản phẩm</div>
            <div className="stat-label-sub">Tất cả danh mục</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CheckCircle2 size={22} /></div>
          <div className="stat-card-details">
            <div className="stat-value">{summary?.available || 0}</div>
            <div className="stat-label">Có sẵn</div>
            <div className="stat-label-sub">Sẵn sàng cho thuê</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><AlertTriangle size={22} /></div>
          <div className="stat-card-details">
            <div className="stat-value">{summary?.out_of_stock || 0}</div>
            <div className="stat-label">Hết hàng</div>
            <div className="stat-label-sub">Cần nhập thêm</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CalendarRange size={22} /></div>
          <div className="stat-card-details">
            <div className="stat-value">{summary?.renting || 0}</div>
            <div className="stat-label">Đang thuê</div>
            <div className="stat-label-sub">Khách đang sử dụng</div>
          </div>
        </div>
      </div>

      <div className="filter-card">
        <div className="filter-row">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên sản phẩm, danh mục..." 
              className="search-input" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="filters-right">
            <LuxeSelect 
              value={selectedCategory} 
              onChange={setSelectedCategory} 
              options={[
                { value: 'all', label: 'Tất cả danh mục' },
                ...categories.map(c => ({ value: c.id, label: c.name }))
              ]}
            />
            <LuxeSelect 
              value={selectedStatus} 
              onChange={setSelectedStatus} 
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'available', label: 'Còn hàng' },
                { value: 'out_of_stock', label: 'Hết hàng' },
                { value: 'renting', label: 'Đang thuê' }
              ]}
            />
            <LuxeSelect 
              value={sortBy} 
              onChange={setSortBy} 
              options={[
                { value: 'newest', label: 'Mới nhất' },
                { value: 'price-low', label: 'Giá: Thấp đến Cao' },
                { value: 'price-high', label: 'Giá: Cao đến Thấp' }
              ]}
            />
          </div>
        </div>
      </div>

      <div className="data-card no-padding overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="checkbox-col"><input type="checkbox" className="cursor-pointer" /></th>
              <th className="product-col">SẢN PHẨM</th>
              <th className="category-col">DANH MỤC</th>
              <th className="price-col">GIÁ / NGÀY</th>
              <th className="inventory-col">TỒN KHO</th>
              <th className="status-col">TRẠNG THÁI</th>
              <th className="actions-col">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => {
              return (
                <tr key={p.id}>
                  <td className="checkbox-col"><input type="checkbox" className="cursor-pointer" /></td>
                  <td className="product-col">
                    <div className="product-info-cell">
                      <div className="product-img-wrapper">
                        <img 
                          src={p.image ? (p.image.startsWith('http') ? p.image : `http://localhost:3000${p.image}`) : "https://via.placeholder.com/50"} 
                          alt="" 
                          className="product-img-small" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/50";
                          }}
                        />
                      </div>
                      <div>
                        <div className="product-name-text">{p.name}</div>
                        <div className="product-rating-row">
                          <div className="stars">{"★".repeat(Math.round(p.rating || 5)) + "☆".repeat(5 - Math.round(p.rating || 5))}</div>
                          <span className="reviews-count">{p.reviews_count || 0} lượt</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="category-col"><span className="category-pill">{p.Category?.name || 'Luxury Collection'}</span></td>
                  <td className="price-col price-text">{p.price_per_day?.toLocaleString('vi-VN')}₫</td>
                  <td className="inventory-col">
                    <div className="inventory-progress-wrapper">
                      <div className="inventory-progress-container">
                        <div 
                          className="inventory-progress-bar" 
                          style={{ 
                            width: `${Math.min((p.stock / 50) * 100, 100)}%`,
                            backgroundColor: p.stock > 10 ? '#22c55e' : p.stock > 0 ? '#f97316' : '#ef4444'
                          }}
                        />
                      </div>
                      <span className="stock-value">{p.stock}</span>
                    </div>
                  </td>
                  <td className="status-col">
                    <span className={`status-pill ${p.status}`}>
                      <div className="status-dot"></div>
                      {p.status === 'available' ? 'Có sẵn' : p.status === 'out_of_stock' ? 'Hết hàng' : 'Đang thuê'}
                    </span>
                  </td>
                  <td className="actions-col">
                    <div className="action-btns-cell">
                      <button className="action-icon-btn" title="Chỉnh sửa" onClick={() => { 
                        setEditMode(true); setIsViewOnly(false); setCurrentId(p.id);
                        const feats = typeof p.features === 'string' ? JSON.parse(p.features) : p.features;
                        setFormData({
                          name: p.name || '', description: p.description || '', price_per_day: p.price_per_day || '',
                          category_id: p.category_id || '', stock: p.stock || 0, status: p.status || 'available',
                          sizes: feats?.sizes || [],
                          colors: Array.isArray(feats?.colors) ? feats.colors : (feats?.colors ? feats.colors.split(',') : [])
                        });
                        setImagePreview(p.image ? (p.image.startsWith('http') ? p.image : `http://localhost:3000${p.image}`) : null); setShowModal(true);
                      }}><Edit2 size={18} /></button>
                      <button className="action-icon-btn delete" title="Xóa sản phẩm" onClick={() => handleDelete(p.id)}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay-luxe">
          <div className="modal-content-luxe">
            <div className="rental-modal-header">
              <div className="header-title-wrapper">
                <h2>{isViewOnly ? 'Chi tiết sản phẩm' : editMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                <p className="modal-subtitle">Điền thông tin sản phẩm mới</p>
              </div>
              <button className="close-modal-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body-content">
                <div className="modal-grid-layout">
                  <div>
                    <div className="form-group">
                      <label>HÌNH ẢNH SẢN PHẨM</label>
                      <div className={`image-upload-zone-luxe ${isViewOnly ? 'disabled' : ''}`} onClick={() => !isViewOnly && document.getElementById('img-up').click()}>
                        {imagePreview ? <img src={imagePreview} className="img-preview-full" /> : (
                          <div className="upload-placeholder-luxe">
                            <div className="upload-icon-circle">
                              <Upload size={20} />
                            </div>
                            <div className="upload-text">Kéo thả hoặc nhấn để tải ảnh</div>
                            <div className="upload-subtext">PNG, JPG, WEBP · Tối đa 5 ảnh · 10MB/ảnh</div>
                          </div>
                        )}
                        <input id="img-up" type="file" hidden onChange={(e) => { const f = e.target.files[0]; if(f){ setSelectedImage(f); setImagePreview(URL.createObjectURL(f)); } }} disabled={isViewOnly} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>TÊN SẢN PHẨM *</label>
                      <input type="text" className="form-input-luxe" placeholder="VD: Đầm Cưới Couture Valentino" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={isViewOnly} />
                    </div>
                    <div className="form-group">
                      <label>MÔ TẢ</label>
                      <textarea className="form-textarea-luxe" rows="3" placeholder="Mô tả chi tiết về sản phẩm..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} disabled={isViewOnly} />
                    </div>
                    <div className="form-group">
                      <label>MÀU SẮC</label>
                      <div className="color-selector-grid">
                        {availableColors.map(color => (
                          <div 
                            key={color.name}
                            className="color-chip-wrapper"
                            onClick={() => !isViewOnly && setFormData(prev => ({
                              ...prev,
                              colors: prev.colors.includes(color.name) 
                                ? prev.colors.filter(c => c !== color.name) 
                                : [...prev.colors, color.name]
                            }))}
                          >
                            <div 
                              className={`color-chip ${formData.colors.includes(color.name) ? 'active' : ''} ${color.hex.toLowerCase() === '#ffffff' ? 'light' : ''}`}
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="color-name">{color.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="form-group">
                      <label>DANH MỤC *</label>
                      <select className="form-input-luxe cursor-pointer" required value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})} disabled={isViewOnly}>
                        <option value="">Chọn danh mục</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>GIÁ / NGÀY *</label>
                      <div className="price-input-wrapper">
                        <input type="number" className="form-input-luxe" required value={formData.price_per_day} onChange={(e) => setFormData({...formData, price_per_day: e.target.value})} disabled={isViewOnly} />
                        <span className="price-symbol">₫</span>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>TỒN KHO</label>
                      <input type="number" className="form-input-luxe" value={formData.stock} onChange={handleStockChange} disabled={isViewOnly} />
                    </div>
                    <div className="form-group">
                      <label>TRẠNG THÁI</label>
                      <div className="status-radio-grid">
                        {statusOptions.map(opt => (
                          <label key={opt.id} className={`status-radio-card ${formData.status === opt.id ? 'active' : ''}`}>
                            <input 
                              type="radio" 
                              name="status" 
                              value={opt.id} 
                              checked={formData.status === opt.id} 
                              onChange={(e) => setFormData({...formData, status: e.target.value})} 
                              hidden 
                              disabled={isViewOnly} 
                            />
                            <div className="radio-circle">
                              {formData.status === opt.id && <div className="radio-circle-inner" />}
                            </div>
                            <span className="status-label-text">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>KÍCH CỠ</label>
                      <div className="size-selector-grid">
                        {availableSizes.map(size => (
                          <button 
                            key={size} type="button"
                            className={`size-chip ${formData.sizes.includes(size) ? 'active' : ''}`}
                            onClick={() => !isViewOnly && setFormData(prev => ({
                              ...prev, 
                              sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
                            }))}
                            disabled={isViewOnly}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              <div className="modal-footer-luxe">
                <button type="button" className="btn-cancel-luxe" onClick={() => setShowModal(false)}>Huỷ bỏ</button>
                <button type="submit" className="btn-save-luxe" disabled={isViewOnly}>{editMode ? 'Lưu thay đổi' : 'Tạo sản phẩm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Centered Luxury Confirmation Modal */}
      {confirmModal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(8, 6, 13, 0.4)',
          backdropFilter: 'blur(6px)',
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
              XÁC NHẬN XÓA
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
    </div>
  );
};

export default ProductManagement;
