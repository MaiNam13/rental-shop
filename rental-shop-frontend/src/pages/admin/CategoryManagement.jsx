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

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await categoryApi.delete(id);
        fetchCategories();
      } catch (error) {
        alert("Lỗi khi xóa danh mục: " + (error.response?.data?.message || error.message));
      }
    }
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
              <div className="category-card-content">
                <h3 className="cat-name">{category.name}</h3>
                <p className="cat-desc">{category.description || 'Chưa có mô tả cho danh mục này.'}</p>
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
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="form-group-luxe">
                  <label>Mô tả chi tiết</label>
                  <textarea 
                    className="form-textarea-luxe"
                    rows="3"
                    placeholder="Mô tả ngắn gọn về danh mục này..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
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
    </div>
  );
};

export default CategoryManagement;
