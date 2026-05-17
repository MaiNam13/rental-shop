import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Check,
  FolderOpen
} from 'lucide-react';
import categoryApi from '../../api/categoryApi';
import { useToast } from '../../context/ToastContext';
import './CategoryManagement.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: "", onConfirm: null });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (showModal || confirmModal.isOpen) {
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
  }, [showModal, confirmModal.isOpen]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data || response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (category) => {
    setEditMode(true);
    setCurrentId(category.id);
    setFormData({
      name: category.name || '',
      description: category.description || ''
    });
    setImagePreview(category.image ? `http://localhost:3000${category.image}` : null);
    setSelectedImage(null);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      message: 'Bạn có chắc chắn muốn xóa danh mục này?',
      onConfirm: async () => {
        try {
          await categoryApi.delete(id);
          toast('Đã xóa danh mục thành công', 'success');
          fetchCategories();
        } catch (error) {
          toast("Lỗi khi xóa danh mục: " + (error.response?.data?.message || error.message), 'error');
        }
        setConfirmModal({ isOpen: false, message: "", onConfirm: null });
      }
    });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setSelectedImage(null);
    setImagePreview(null);
    setEditMode(false);
    setCurrentId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description || '');

    if (selectedImage) {
      data.append('image', selectedImage);
    }

    try {
      if (editMode) {
        await categoryApi.update(currentId, data);
      } else {
        await categoryApi.create(data);
      }

      setShowModal(false);
      fetchCategories();
      resetForm();
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="category-management-container">
      <div className="category-header">
        <div>
          <h1 className="category-title">Danh mục sản phẩm</h1>
          <p className="category-subtitle">Phân loại bộ sưu tập thời trang của bạn.</p>
        </div>
        <button className="btn-add-luxe" onClick={() => { resetForm(); setShowModal(true); }}>
          <Plus size={20} /> Thêm danh mục mới
        </button>
      </div>

      <div className="user-controls" style={{ marginTop: '32px', borderRadius: '24px' }}>
        <div className="user-search-wrapper" style={{ width: '100%', maxWidth: '100%' }}>
          <Search size={18} />
          <input
            type="text"
            className="user-search-input"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="user-loading">Đang tải danh mục...</div>
      ) : (
        <div className="category-grid">
          {filteredCategories.map((category) => (
            <div key={category.id} className="category-card-luxe">
              <div className="category-image-wrapper">
                <img
                  src={category.image ? `http://localhost:3000${category.image}` : "https://via.placeholder.com/400x200?text=Luxury+Collection"}
                  alt={category.name}
                  className="category-image-luxe"
                />
              </div>
              <div className="category-card-content-luxe">
                <h3 className="cat-name">{category.name}</h3>
                <div className="cat-actions">
                  <button className="btn-cat-edit" onClick={() => handleEdit(category)}>
                    <Edit2 size={14} /> Sửa
                  </button>
                  <button className="btn-cat-delete" onClick={() => handleDelete(category.id)}>
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#888' }}>
              <FolderOpen size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
              <p>Không tìm thấy danh mục nào.</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="cat-modal-overlay">
          <div className="cat-modal-content">
            <div className="cat-modal-header">
              <h2>{editMode ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h2>
              <button className="close-btn-luxe" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="cat-modal-body">
                <div className="form-group-luxe">
                  <label>Tên danh mục</label>
                  <input
                    type="text"
                    className="form-input-luxe"
                    placeholder="Ví dụ: Váy dạ hội, Vest nam..."
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group-luxe">
                  <label>Hình ảnh đại diện</label>
                  <label className="image-upload-zone-luxe">
                    <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                    {imagePreview ? (
                      <img src={imagePreview} className="preview-image-luxe" alt="Preview" />
                    ) : (
                      <>
                        <Upload size={32} color="#ccc" style={{ marginBottom: '8px' }} />
                        <span style={{ fontSize: '13px', color: '#888', fontWeight: '600' }}>Nhấn để tải lên hình ảnh</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
              <div className="cat-modal-footer">
                <button type="button" className="btn-modal-cancel-luxe" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-modal-submit-luxe">{editMode ? 'Cập nhật' : 'Tạo danh mục'}</button>
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

export default CategoryManagement;
