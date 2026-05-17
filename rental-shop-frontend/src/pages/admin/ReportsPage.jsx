import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Search, 
  Phone, 
  Check,
  Calendar,
  Truck,
  CalendarRange,
  History
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../context/ToastContext';
import './ReportsPage.css';

const ReportsPage = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('approved'); // 'approved', 'shipping', 'renting', 'overdue', 'returned'
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/admin/rentals');
      setRentals(response.data);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      toast('Không thể tải danh sách đơn thuê', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus, successMsg) => {
    try {
      setUpdatingStatus(true);
      await axiosClient.put(`/admin/rentals/${id}/status`, { status: newStatus });
      toast(successMsg || 'Cập nhật trạng thái thành công');
      // Update local state
      setRentals(rentals.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error('Error updating status:', error);
      toast('Lỗi khi cập nhật trạng thái đơn thuê', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getDaysDiff = (endDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(endDateStr);
    endDate.setHours(0, 0, 0, 0);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Categorize dynamically
  const approvedRentals = rentals.filter(r => r.status === 'approved');
  const shippingRentals = rentals.filter(r => r.status === 'shipping');
  const rentingRentals = rentals.filter(r => r.status === 'renting' && getDaysDiff(r.end_date) >= 0);
  const overdueRentals = rentals.filter(r => r.status === 'renting' && getDaysDiff(r.end_date) < 0);
  const returnedRentals = rentals.filter(r => r.status === 'returned');

  const getActiveList = () => {
    switch (activeTab) {
      case 'approved':
        return approvedRentals;
      case 'shipping':
        return shippingRentals;
      case 'renting':
        return rentingRentals;
      case 'overdue':
        return overdueRentals;
      case 'returned':
        return returnedRentals;
      default:
        return [];
    }
  };

  const filteredList = getActiveList().filter(r => 
    r.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id?.toString().includes(searchTerm) ||
    r.RentalItems?.some(item => item.Product?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="reports-page-container">
      <div className="reports-header-admin">
        <h1 className="reports-title-admin">Giám sát giao nhận & Hạn thuê</h1>
        <p className="reports-subtitle-admin">Theo dõi lịch trình vận chuyển, đang thuê và thời gian hoàn trả thực tế của khách hàng</p>
      </div>

      {/* KPI 5-Tab Grid at top */}
      <div className="reports-kpi-grid">
        <div 
          className={`kpi-term-card approved ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          <div className="kpi-icon-box approved">
            <Clock size={18} />
          </div>
          <div className="kpi-info-box">
            <span className="kpi-label">Chờ giao đồ</span>
            <span className="kpi-value approved">{approvedRentals.length}</span>
          </div>
        </div>

        <div 
          className={`kpi-term-card shipping ${activeTab === 'shipping' ? 'active' : ''}`}
          onClick={() => setActiveTab('shipping')}
        >
          <div className="kpi-icon-box shipping">
            <Truck size={18} />
          </div>
          <div className="kpi-info-box">
            <span className="kpi-label">Đang giao hàng</span>
            <span className="kpi-value shipping">{shippingRentals.length}</span>
          </div>
        </div>

        <div 
          className={`kpi-term-card renting ${activeTab === 'renting' ? 'active' : ''}`}
          onClick={() => setActiveTab('renting')}
        >
          <div className="kpi-icon-box renting">
            <CalendarRange size={18} />
          </div>
          <div className="kpi-info-box">
            <span className="kpi-label">Đang thuê đồ</span>
            <span className="kpi-value renting">{rentingRentals.length}</span>
          </div>
        </div>

        <div 
          className={`kpi-term-card overdue ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => setActiveTab('overdue')}
        >
          <div className="kpi-icon-box overdue">
            <AlertTriangle size={18} />
          </div>
          <div className="kpi-info-box">
            <span className="kpi-label">Quá hạn trả</span>
            <span className="kpi-value overdue">{overdueRentals.length}</span>
          </div>
        </div>

        <div 
          className={`kpi-term-card returned ${activeTab === 'returned' ? 'active' : ''}`}
          onClick={() => setActiveTab('returned')}
        >
          <div className="kpi-icon-box returned">
            <CheckCircle2 size={18} />
          </div>
          <div className="kpi-info-box">
            <span className="kpi-label">Đã trả đồ</span>
            <span className="kpi-value returned">{returnedRentals.length}</span>
          </div>
        </div>
      </div>

      <div className="reports-data-card">
        {/* Search controls */}
        <div className="reports-controls">
          <div className="reports-search-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              className="reports-search-input"
              placeholder="Tìm theo tên khách, SĐT hoặc mã đơn..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="reports-count-label">
            Tìm thấy: <span className="reports-count-value">{filteredList.length}</span> đơn thuê
          </div>
        </div>

        {loading ? (
          <div className="reports-loading">Đang tải và cập nhật dữ liệu...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Sản phẩm thuê</th>
                <th>Thời hạn thuê</th>
                <th>Trạng thái / Thời gian</th>
                <th className="text-right">Thao tác nhanh</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length > 0 ? filteredList.map((rental) => {
                const daysDiff = getDaysDiff(rental.end_date);
                const startDaysDiff = getDaysDiff(rental.start_date);
                
                return (
                  <tr key={rental.id}>
                    <td>
                      <div className="reports-user-cell">
                        <div className="reports-user-avatar">
                          {rental.full_name?.charAt(0).toUpperCase() || 'K'}
                        </div>
                        <div>
                          <div className="reports-user-name">{rental.full_name || rental.User?.name}</div>
                          <div className="reports-user-contact">
                            <Phone size={12} /> {rental.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="reports-products-cell">
                        {rental.RentalItems?.map((item, idx) => (
                          <div key={idx} className="reports-product-item">
                            <span className="reports-product-name">{item.Product?.name}</span>
                            <span className="reports-product-meta">
                              Size: {item.size} · SL: {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="reports-date-cell">
                        <Calendar size={13} color="#888" />
                        <div>
                          <div className="date-range">
                            {new Date(rental.start_date).toLocaleDateString('vi-VN')} - {new Date(rental.end_date).toLocaleDateString('vi-VN')}
                          </div>
                          <div className="date-id">Đơn hàng #{rental.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {rental.status === 'approved' && (
                        <span className="reports-status-pill soon" style={{ backgroundColor: '#e0e7ff', color: '#6366f1', borderColor: '#c7d2fe' }}>
                          {startDaysDiff > 0 ? `Đợi giao (Còn ${startDaysDiff} ngày đến hạn)` : startDaysDiff === 0 ? 'Giao đồ hôm nay' : `Trễ giao đồ (${Math.abs(startDaysDiff)} ngày)`}
                        </span>
                      )}
                      {rental.status === 'shipping' && (
                        <span className="reports-status-pill active" style={{ backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' }}>
                          📦 Đang vận chuyển
                        </span>
                      )}
                      {rental.status === 'renting' && (
                        daysDiff < 0 ? (
                          <span className="reports-status-pill overdue">
                            Quá hạn {Math.abs(daysDiff)} ngày
                          </span>
                        ) : daysDiff <= 2 ? (
                          <span className="reports-status-pill soon">
                            Sắp trả (Còn {daysDiff} ngày)
                          </span>
                        ) : (
                          <span className="reports-status-pill active">
                            Còn hạn (Còn {daysDiff} ngày)
                          </span>
                        )
                      )}
                      {rental.status === 'returned' && (
                        <span className="reports-status-pill active" style={{ backgroundColor: '#d1fae5', color: '#065f46', borderColor: '#a7f3d0' }}>
                          ✔️ Đã trả (Hoàn tất)
                        </span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="reports-actions-cell">
                        {rental.status === 'approved' && (
                          <button 
                            className="btn-confirm-return"
                            onClick={() => handleUpdateStatus(rental.id, 'shipping', 'Đơn thuê đã chuyển sang trạng thái Đang giao hàng!')}
                            title="Xác nhận giao hàng cho shipper"
                            style={{ backgroundColor: '#6366f1', color: '#fff', borderColor: '#6366f1' }}
                            disabled={updatingStatus}
                          >
                            <Truck size={14} /> Giao hàng
                          </button>
                        )}
                        {rental.status === 'shipping' && (
                          <button 
                            className="btn-confirm-return"
                            onClick={() => handleUpdateStatus(rental.id, 'renting', 'Đơn thuê đã chuyển sang trạng thái Khách hàng đang thuê!')}
                            title="Xác nhận khách đã nhận đồ và bắt đầu thuê"
                            style={{ backgroundColor: '#f59e0b', color: '#fff', borderColor: '#f59e0b' }}
                            disabled={updatingStatus}
                          >
                            <CalendarRange size={14} /> Đang thuê
                          </button>
                        )}
                        {rental.status === 'renting' && (
                          <button 
                            className="btn-confirm-return"
                            onClick={() => handleUpdateStatus(rental.id, 'returned', 'Đã xác nhận khách trả đồ thành công!')}
                            title="Xác nhận khách đã trả đồ"
                            style={{ backgroundColor: '#10b981', color: '#fff', borderColor: '#10b981' }}
                            disabled={updatingStatus}
                          >
                            <Check size={14} /> Trả đồ
                          </button>
                        )}
                        {rental.status === 'returned' && (
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={14} /> Hoàn tất
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" className="no-data-cell">Không có đơn thuê nào khớp với bộ lọc.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
