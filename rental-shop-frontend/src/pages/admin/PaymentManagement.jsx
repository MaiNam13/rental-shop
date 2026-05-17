import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign,
  Download,
  TrendingUp,
  RefreshCcw,
  Wallet,
  Smartphone,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../context/ToastContext';
import './PaymentManagement.css';

const COLORS = ['#1a1a1a', '#c5a059', '#10b981', '#6366f1', '#ef4444'];

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({});
  const [chartData, setChartData] = useState([]);
  const [methodData, setMethodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/admin/payments');
      setPayments(response.data.payments);
      setSummary(response.data.summary);
      setChartData(response.data.chartData);
      setMethodData(response.data.methodData);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast('Không thể tải dữ liệu thanh toán', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axiosClient.put(`/admin/payments/${id}/status`, { status: newStatus });
      toast('Cập nhật trạng thái thành công');
      fetchPayments();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast('Cập nhật thất bại', 'error');
    }
  };

  const filteredPayments = payments.filter(payment => {
    const userName = payment.Rental?.User?.name?.toLowerCase() || '';
    const rentalId = payment.rental_id?.toString() || '';
    const transactionId = payment.id?.toString() || '';
    const matchesSearch = 
      userName.includes(searchTerm.toLowerCase()) || 
      rentalId.includes(searchTerm) ||
      transactionId.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Đã thanh toán';
      case 'pending': return 'Chờ xử lý';
      case 'failed': return 'Thất bại';
      case 'refunded': return 'Hoàn tiền';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'failed': return <XCircle size={14} />;
      case 'refunded': return <RefreshCcw size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getMethodLabel = (method) => {
    switch (method?.toLowerCase()) {
      case 'cod': return 'Thanh toán COD';
      case 'vnpay': return 'Cổng VNPay';
      case 'momo': return 'Ví MoMo';
      case 'bank_transfer':
      case 'bank': return 'Chuyển khoản';
      default: return method || 'Chuyển khoản';
    }
  };

  return (
    <div className="payment-management-container">
      <div className="payment-header-admin">
        <h1 className="payment-title-admin">Quản trị tài chính</h1>
        <p className="payment-subtitle-admin">Theo dõi dòng tiền và hiệu suất thanh toán thời gian thực.</p>
      </div>

      <div className="payment-overview">
        <div className="p-stat-card">
          <div className="p-stat-info">
            <span className="p-stat-label">Doanh thu tổng</span>
            <div className="p-stat-value">{summary.totalRevenue?.toLocaleString('vi-VN')}₫</div>
          </div>
          <div className="p-stat-icon-box">
            <DollarSign size={24} />
          </div>
        </div>
        <div className="p-stat-card">
          <div className="p-stat-info">
            <span className="p-stat-label">Giao dịch thành công</span>
            <div className="p-stat-value">{summary.completedCount || 0}</div>
          </div>
          <div className="p-stat-icon-box">
            <CheckCircle2 size={24} />
          </div>
        </div>
        <div className="p-stat-card">
          <div className="p-stat-info">
            <span className="p-stat-label">Tỷ lệ tăng trưởng</span>
            <div className="p-stat-value" style={{ color: '#10b981' }}>+12.5%</div>
          </div>
          <div className="p-stat-icon-box">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      <div className="payment-charts">
        <div className="payment-chart-card">
          <div className="p-chart-header">
            <h3 className="p-chart-title">Biến động dòng tiền</h3>
            <span className="view-all">30 ngày qua</span>
          </div>
          <div className="p-chart-container">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="pColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value.toLocaleString()}₫`, 'Doanh thu']}
                />
                <Area type="monotone" dataKey="value" stroke="#c5a059" strokeWidth={3} fillOpacity={1} fill="url(#pColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="payment-chart-card">
          <div className="p-chart-header">
            <h3 className="p-chart-title">Phương thức</h3>
          </div>
          <div className="p-chart-container">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={methodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {methodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="payment-data-card">
        <div className="payment-controls">
          <div className="p-search-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              className="p-search-input"
              placeholder="Tìm theo mã đơn, khách hàng..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="p-filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="completed">Đã thanh toán</option>
            <option value="pending">Chờ xử lý</option>
            <option value="failed">Thất bại</option>
            <option value="refunded">Hoàn tiền</option>
          </select>
        </div>

        {loading ? (
          <div className="user-loading">Đang tải dữ liệu...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Giao dịch</th>
                <th>Đơn thuê</th>
                <th>Khách hàng</th>
                <th>Phương thức</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="font-800">#{payment.id}</td>
                  <td className="order-id-cell">#{payment.rental_id}</td>
                  <td className="customer-name-cell">{payment.Rental?.User?.name || 'Khách hàng'}</td>
                  <td>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#555555' }}>
                      {getMethodLabel(payment.method)}
                    </span>
                  </td>
                  <td className="font-900">{payment.amount?.toLocaleString('vi-VN')}₫</td>
                  <td>
                    <span className={`p-status-pill ${payment.status}`}>
                      {getStatusIcon(payment.status)}
                      {getStatusLabel(payment.status)}
                    </span>
                  </td>
                  <td className="text-right">
                    {payment.status === 'pending' && (
                      <button 
                        className="p-action-btn"
                        onClick={() => handleUpdateStatus(payment.id, 'completed')}
                      >
                        Xác nhận
                      </button>
                    )}
                    {payment.status === 'completed' && (
                      <button className="action-icon-btn"><Download size={16} /></button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="no-data-cell">Không tìm thấy giao dịch nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
