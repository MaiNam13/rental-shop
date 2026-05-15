import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  CalendarRange, 
  CreditCard, 
  Clock, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Edit2,
  Plus,
  Tags,
  BarChart3,
  Star,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from 'recharts';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import '../../styles/AdminDashboard.css';
import './DashboardPage.css';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosClient.get('/admin/stats');
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Đang tải dữ liệu thực tế...</div>;
  }

  const { stats, recentRentals, topProducts, monthlyRevenue } = data || {};

  const statCards = [
    { label: 'Tổng người dùng', value: stats?.totalUsers || 0, trend: '+0%', icon: <Users size={20} />, up: true },
    { label: 'Tổng sản phẩm', value: stats?.totalProducts || 0, trend: '+0%', icon: <Package size={20} />, up: true },
    { label: 'Đang cho thuê', value: stats?.rentingCount || 0, trend: '+0%', icon: <CalendarRange size={20} />, up: true },
    { label: 'Doanh thu thực tế', value: `${(stats?.totalRevenue || 0).toLocaleString()} ₫`, trend: '+0%', icon: <CreditCard size={20} />, up: true },
    { label: 'Đơn chờ duyệt', value: stats?.pendingCount || 0, trend: '+0%', icon: <Clock size={20} />, up: false },
    { label: 'Đã hoàn trả', value: stats?.returnedCount || 0, trend: '+0%', icon: <RotateCcw size={20} />, up: true },
  ];

  const revenueChartData = (monthlyRevenue || []).map(item => ({
    name: `T${item.month}`,
    value: item.revenue / 1000000 
  }));

  const displayRevenueData = revenueChartData.length > 0 ? revenueChartData : [{ name: 'Chưa có dữ liệu', value: 0 }];

  const getStatusClass = (status) => {
    switch (status) {
      case 'returned': return 'status-returned';
      case 'renting': return 'status-shipping';
      case 'approved': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-overdue';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'returned': return 'Đã trả';
      case 'renting': return 'Đang thuê';
      case 'approved': return 'Đã xác nhận';
      case 'pending': return 'Chờ duyệt';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Trang quản trị</h1>
        <p>Thống kê dựa trên dữ liệu thực tế từ hệ thống của bạn</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className={`stat-trend ${stat.up ? 'trend-up' : 'trend-down'}`}>
              {stat.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="card-header">
            <div>
              <h3 className="chart-title">Biến động doanh thu</h3>
              <p className="chart-subtitle">Hiệu suất thực tế (triệu VNĐ)</p>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer>
              <AreaChart data={displayRevenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value.toFixed(2)}tr ₫`, 'Doanh thu']}
                />
                <Area type="monotone" dataKey="value" stroke="#c5a059" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="data-card">
        <div className="card-header">
          <h3 className="chart-title">Đơn thuê gần đây</h3>
          <Link to="/admin/rentals" className="view-all">Xem tất cả →</Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày tạo</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {(recentRentals || []).length > 0 ? recentRentals.map((rental, idx) => (
              <tr key={idx}>
                <td className="order-id">#{rental.id}</td>
                <td>
                  <div className="customer-cell">
                    <div className="customer-initials">{(rental.User?.name || 'K').charAt(0)}</div>
                    <span>{rental.User?.name || 'Khách vãng lai'}</span>
                  </div>
                </td>
                <td style={{ fontSize: 11, color: '#666' }}>{new Date(rental.createdAt).toLocaleDateString()}</td>
                <td style={{ fontWeight: 700 }}>{rental.total_price?.toLocaleString()}₫</td>
                <td>
                  <span className={`status-badge ${getStatusClass(rental.status)}`}>
                    {getStatusLabel(rental.status)}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="action-icon"><Eye size={16} /></button>
                    <button className="action-icon"><Edit2 size={16} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Chưa có đơn thuê nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid-2-1" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
        <div className="chart-card">
          <div className="card-header">
            <h3 className="chart-title">Sản phẩm thuê nhiều nhất</h3>
            <span className="view-all">Dữ liệu thực tế</span>
          </div>
          <div className="top-products-list">
            {(topProducts || []).length > 0 ? topProducts.map((item, idx) => (
              <div key={idx} className="product-item">
                <div className="product-rank">{idx + 1}</div>
                <div className="product-info">
                  <div className="product-name">{item.Product?.name || 'Sản phẩm đã xóa'}</div>
                  <div className="product-category">{item.Product?.category || 'N/A'}</div>
                </div>
                <div className="product-progress-wrapper">
                  <div className="product-progress-bar" style={{ width: `${Math.min((item.rental_count / (topProducts[0]?.rental_count || 1)) * 100, 100)}%` }}></div>
                </div>
                <div className="product-stats">
                  <div className="product-revenue">{item.total_revenue?.toLocaleString()}₫</div>
                  <div className="product-rating">
                    <Star size={10} fill="#c5a059" /> {item.Product?.rating || 5.0} · {item.rental_count} lượt
                  </div>
                </div>
              </div>
            )) : (
              <p style={{ textAlign: 'center', color: '#888' }}>Chưa có dữ liệu sản phẩm</p>
            )}
          </div>
        </div>

        <div className="chart-card" style={{ gridColumn: 'span 2' }}>
          <h3 className="chart-title" style={{ marginBottom: 24 }}>Tóm tắt kho hàng</h3>
          <div className="inventory-grid">
            {/* Available */}
            <div className="inventory-card">
              <div className="inventory-card-header">
                <div className="inventory-icon-wrapper" style={{ backgroundColor: '#f0fdf4', color: '#22c55e' }}>
                  <CheckCircle2 size={20} />
                </div>
                <span className="inventory-tag">KHO HÀNG</span>
              </div>
              <div className="inventory-value">{stats?.availableCount || 0}</div>
              <div className="inventory-label">Sản phẩm có sẵn</div>
              <div className="inventory-progress-bg">
                <div className="inventory-progress-fill" style={{ width: '100%', backgroundColor: '#22c55e' }}></div>
              </div>
              <div className="inventory-footer">Sẵn sàng cho thuê</div>
            </div>

            {/* Renting */}
            <div className="inventory-card">
              <div className="inventory-card-header">
                <div className="inventory-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                  <CalendarRange size={20} />
                </div>
                <span className="inventory-tag">KHO HÀNG</span>
              </div>
              <div className="inventory-value">{stats?.rentingCount || 0}</div>
              <div className="inventory-label">Đang cho thuê</div>
              <div className="inventory-progress-bg">
                <div className="inventory-progress-fill" style={{ width: `${Math.min((stats?.rentingCount / (stats?.totalProducts || 1)) * 100, 100)}%`, backgroundColor: '#3b82f6' }}></div>
              </div>
              <div className="inventory-footer">Hiện đang được thuê</div>
            </div>

            {/* Low Stock */}
            <div className="inventory-card">
              <div className="inventory-card-header">
                <div className="inventory-icon-wrapper" style={{ backgroundColor: '#fff7ed', color: '#f97316' }}>
                  <AlertTriangle size={20} />
                </div>
                <span className="inventory-tag">KHO HÀNG</span>
              </div>
              <div className="inventory-value">{stats?.lowStockCount || 0}</div>
              <div className="inventory-label">Tồn kho thấp</div>
              <div className="inventory-progress-bg">
                <div className="inventory-progress-fill" style={{ width: `${Math.min((stats?.lowStockCount / (stats?.totalProducts || 1)) * 100, 100)}%`, backgroundColor: '#f97316' }}></div>
              </div>
              <div className="inventory-footer">Cần nhập thêm hàng</div>
            </div>

            {/* Damaged */}
            <div className="inventory-card">
              <div className="inventory-card-header">
                <div className="inventory-icon-wrapper" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                  <XCircle size={20} />
                </div>
                <span className="inventory-tag">KHO HÀNG</span>
              </div>
              <div className="inventory-value">{stats?.damagedCount || 0}</div>
              <div className="inventory-label">Sản phẩm hỏng</div>
              <div className="inventory-progress-bg">
                <div className="inventory-progress-fill" style={{ width: `${Math.min((stats?.damagedCount / (stats?.totalProducts || 1)) * 100, 100)}%`, backgroundColor: '#ef4444' }}></div>
              </div>
              <div className="inventory-footer">Đang kiểm tra</div>
            </div>
          </div>
        </div>
      </div>

      <div className="data-card">
        <h3 className="chart-title" style={{ marginBottom: 24 }}>Thao tác nhanh</h3>
        <div className="quick-actions-grid">
          <Link to="/admin/products" className="action-card">
            <div className="action-icon-box"><Package size={24} /></div>
            <span className="action-label">Sản phẩm</span>
          </Link>
          <Link to="/admin/categories" className="action-card">
            <div className="action-icon-box"><Tags size={24} /></div>
            <span className="action-label">Danh mục</span>
          </Link>
          <Link to="/admin/rentals" className="action-card">
            <div className="action-icon-box"><CalendarRange size={24} /></div>
            <span className="action-label">Đơn thuê</span>
          </Link>
          <Link to="/admin/users" className="action-card">
            <div className="action-icon-box"><Users size={24} /></div>
            <span className="action-label">Người dùng</span>
          </Link>
          <Link to="/admin/reports" className="action-card">
            <div className="action-icon-box"><BarChart3 size={24} /></div>
            <span className="action-label">Báo cáo</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
