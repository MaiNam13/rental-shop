import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Mail, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../context/ToastContext';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast('Không thể tải danh sách người dùng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      setDeletingId(id);
      await axiosClient.delete(`/admin/users/${id}`);
      toast('Đã xóa người dùng thành công');
      setUsers(users.filter(u => u.id !== id));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast('Lỗi khi xóa người dùng', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-management-container">
      <div className="user-header">
        <h1 className="user-title">Quản lý người dùng</h1>
        <p className="user-subtitle">Quản lý tài khoản và quyền hạn thành viên</p>
      </div>

      <div className="user-data-card">
        <div className="user-controls">
          <div className="user-search-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              className="user-search-input"
              placeholder="Tìm theo tên hoặc email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="user-count-label">
            Tổng số: <span className="user-count-value">{users.length}</span> thành viên
          </div>
        </div>

        {loading ? (
          <div className="user-loading">Đang tải dữ liệu...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tham gia</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info-cell">
                      <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="user-name">{user.name}</div>
                        <div className="user-id">ID: #{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="user-contact">
                      <Mail size={14} color="#888" /> {user.email}
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                      {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </span>
                  </td>
                  <td>
                    <div className="user-date">
                      <Calendar size={14} color="#bbb" />
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                  </td>
                  <td className="text-right">
                    {user.role !== 'admin' && (
                      <button 
                        className="btn-delete"
                        onClick={() => setShowDeleteConfirm(user.id)}
                        disabled={deletingId === user.id}
                        title="Xóa người dùng"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="no-data-cell">Không tìm thấy người dùng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="user-delete-modal-overlay">
          <div className="user-delete-modal-content">
            <div className="delete-alert-icon">
              <AlertCircle size={40} />
            </div>
            <h3 className="delete-modal-title">Xác nhận xóa</h3>
            <p className="delete-modal-text">
              Bạn có chắc chắn muốn xóa người dùng này? Hành động này sẽ xóa vĩnh viễn tài khoản và không thể hoàn tác.
            </p>
            <div className="delete-modal-actions">
              <button 
                className="btn-modal-cancel" 
                onClick={() => setShowDeleteConfirm(null)} 
              >
                Hủy
              </button>
              <button 
                className="btn-modal-delete" 
                onClick={() => handleDeleteUser(showDeleteConfirm)} 
                disabled={deletingId !== null}
              >
                {deletingId ? 'Đang xóa...' : 'Xóa ngay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
