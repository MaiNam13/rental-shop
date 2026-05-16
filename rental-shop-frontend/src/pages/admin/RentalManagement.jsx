import React, { useState, useEffect } from 'react';
import { 
  CalendarRange, 
  Search, 
  Eye, 
  CheckCircle2, 
  Truck, 
  History, 
  XCircle,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  User,
  X,
  CreditCard,
  Package
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../context/ToastContext';
import './RentalManagement.css';

const RentalManagement = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRental, setSelectedRental] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRentals();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedRental ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedRental]);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/admin/rentals');
      setRentals(response.data);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      toast('Lỗi khi tải danh sách đơn thuê', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingStatus(true);
      await axiosClient.put(`/admin/rentals/${id}/status`, { status: newStatus });
      toast('Cập nhật trạng thái thành công');
      setRentals(rentals.map(r => r.id === id ? { ...r, status: newStatus } : r));
      if (selectedRental && selectedRental.id === id) {
        setSelectedRental({ ...selectedRental, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast('Cập nhật trạng thái thất bại', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredRentals = rentals.filter(rental => {
    const name = rental.full_name?.toLowerCase() || rental.User?.name?.toLowerCase() || '';
    const id = rental.id.toString();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || id.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || rental.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'shipping': return 'Đang giao';
      case 'renting': return 'Đang thuê';
      case 'returned': return 'Đã trả đồ';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={14} />;
      case 'shipping': return <Truck size={14} />;
      case 'renting': return <CheckCircle2 size={14} />;
      case 'returned': return <History size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="rental-management-container">
      <div className="rental-header">
        <h1 className="rental-title">Quản lý đơn thuê</h1>
        <p className="rental-subtitle">Theo dõi lịch trình và trạng thái thuê từ dữ liệu thực tế.</p>
      </div>

      <div className="rental-data-card">
        <div className="rental-controls">
          <div className="rental-search-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              className="rental-search-input"
              placeholder="Tìm theo mã đơn hoặc tên khách hàng..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="rental-filters">
            <select 
              className="rental-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="shipping">Đang giao</option>
              <option value="renting">Đang thuê</option>
              <option value="returned">Đã trả đồ</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="user-loading">Đang tải dữ liệu...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày thuê</th>
                <th>Ngày trả</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRentals.length > 0 ? filteredRentals.map((rental) => (
                <tr key={rental.id}>
                  <td className="order-id-cell">#{rental.id}</td>
                  <td className="customer-name-cell">{rental.full_name || rental.User?.name}</td>
                  <td className="date-cell">{new Date(rental.rental_date || rental.start_date).toLocaleDateString('vi-VN')}</td>
                  <td className="date-cell">{new Date(rental.return_date || rental.end_date).toLocaleDateString('vi-VN')}</td>
                  <td className="price-text-luxe">{rental.total_price?.toLocaleString('vi-VN')}₫</td>
                  <td>
                    <span className={`status-pill-luxe ${rental.status}`}>
                      {getStatusIcon(rental.status)}
                      {getStatusLabel(rental.status)}
                    </span>
                  </td>
                  <td className="text-right">
                    <button 
                      className="action-icon-btn"
                      onClick={() => setSelectedRental(rental)}
                      title="Xem chi tiết"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="no-data-cell">Không tìm thấy đơn thuê nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedRental && (
        <div className="rental-detail-modal-overlay">
          <div className="rental-detail-modal-content">
            <div className="modal-detail-header">
              <h2>Chi tiết đơn thuê #{selectedRental.id}</h2>
              <button className="close-modal-btn" onClick={() => setSelectedRental(null)}><X size={20} /></button>
            </div>
            
            <div className="modal-detail-body">
              <div className="detail-grid">
                <div>
                  <div className="detail-section-title"><User size={16} /> Thông tin khách hàng</div>
                  <div className="detail-info-card">
                    <div className="info-row">
                      <span className="info-label">Họ tên:</span>
                      <span className="info-value">{selectedRental.full_name || selectedRental.User?.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{selectedRental.email || selectedRental.User?.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Số điện thoại:</span>
                      <span className="info-value">{selectedRental.phone}</span>
                    </div>
                    <div className="info-row" style={{ flexDirection: 'column', gap: '4px' }}>
                      <span className="info-label">Địa chỉ:</span>
                      <span className="info-value" style={{ textAlign: 'left' }}>{selectedRental.address}</span>
                    </div>
                  </div>

                  <div className="detail-section-title" style={{ marginTop: '32px' }}><Package size={16} /> Sản phẩm thuê</div>
                  <div className="products-list-luxe">
                    {selectedRental.RentalItems?.map((item, idx) => (
                      <div key={idx} className="product-item-row">
                        <img 
                          src={item.Product?.image ? (item.Product.image.startsWith('http') ? item.Product.image : `http://localhost:3000${item.Product.image}`) : "https://via.placeholder.com/60"} 
                          className="product-thumb-small" 
                          alt=""
                        />
                        <div style={{ flex: 1 }}>
                          <div className="product-detail-name">{item.Product?.name}</div>
                          <div className="product-detail-meta">Size: {item.size} | SL: {item.quantity}</div>
                        </div>
                        <div className="price-text-luxe">{(item.total_price || (item.price * item.quantity))?.toLocaleString('vi-VN')}₫</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="detail-section-title"><CalendarRange size={16} /> Thông tin thuê</div>
                  <div className="detail-info-card">
                    <div className="info-row">
                      <span className="info-label">Ngày bắt đầu:</span>
                      <span className="info-value">{new Date(selectedRental.rental_date || selectedRental.start_date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Ngày kết thúc:</span>
                      <span className="info-value">{new Date(selectedRental.return_date || selectedRental.end_date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Trạng thái hiện tại:</span>
                      <span className={`status-pill-luxe ${selectedRental.status}`}>
                        {getStatusLabel(selectedRental.status)}
                      </span>
                    </div>
                  </div>

                  <div className="order-summary-luxe">
                    <div className="total-row-luxe">
                      <span className="total-label">Tổng giá trị:</span>
                      <span className="total-amount-luxe">{selectedRental.total_price?.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>

                  <div className="modal-actions-luxe">
                    <div style={{ width: '100%', marginBottom: '12px', fontSize: '11px', fontWeight: '800', color: '#aaa', textTransform: 'uppercase' }}>Cập nhật trạng thái</div>
                    <button 
                      className={`btn-status-update ${selectedRental.status === 'shipping' ? 'active' : ''}`}
                      onClick={() => handleUpdateStatus(selectedRental.id, 'shipping')}
                      disabled={updatingStatus}
                    >
                      <Truck size={14} /> Giao hàng
                    </button>
                    <button 
                      className={`btn-status-update ${selectedRental.status === 'renting' ? 'active' : ''}`}
                      onClick={() => handleUpdateStatus(selectedRental.id, 'renting')}
                      disabled={updatingStatus}
                    >
                      <CheckCircle2 size={14} /> Đang thuê
                    </button>
                    <button 
                      className={`btn-status-update ${selectedRental.status === 'returned' ? 'active' : ''}`}
                      onClick={() => handleUpdateStatus(selectedRental.id, 'returned')}
                      disabled={updatingStatus}
                    >
                      <History size={14} /> Đã trả
                    </button>
                    <button 
                      className={`btn-status-update ${selectedRental.status === 'cancelled' ? 'active' : ''}`}
                      onClick={() => handleUpdateStatus(selectedRental.id, 'cancelled')}
                      disabled={updatingStatus}
                    >
                      <XCircle size={14} /> Hủy đơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalManagement;
