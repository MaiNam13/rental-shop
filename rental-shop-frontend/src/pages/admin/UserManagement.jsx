import React, { useState, useEffect } from 'react';
import {
  Search,
  Trash2,
  Mail,
  Calendar,
  AlertCircle,
  Lock,
  Unlock,
  X
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
  const [selectedUser, setSelectedUser] = useState(null);
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

  const handleToggleLock = async (id) => {
    try {
      const response = await axiosClient.put(`/admin/users/${id}/toggle-lock`);
      toast(response.data.message);
      setUsers(users.map(u => u.id === id ? { ...u, is_locked: !u.is_locked } : u));
    } catch (error) {
      console.error('Error toggling user lock:', error);
      toast('Lỗi khi thay đổi trạng thái tài khoản', 'error');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-management-container">
      <div className="user-header-admin">
        <h1 className="user-title-admin">Quản lý người dùng</h1>
        <p className="user-subtitle-admin">Quản lý tài khoản và quyền hạn thành viên</p>
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
                <tr key={user.id} className={user.is_locked ? 'row-locked' : ''}>
                  <td>
                    <div className="user-info-cell">
                      <div className={`user-avatar ${user.is_locked ? 'avatar-locked' : ''}`}>
                        {user.is_locked ? <Lock size={14} /> : user.name?.charAt(0).toUpperCase()}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                      </span>
                      {user.is_locked && (
                        <span className="user-locked-badge">Bị khóa</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="user-date">
                      <Calendar size={14} color="#bbb" />
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="user-actions-cell">
                      <button
                        className="btn-user-detail-action"
                        onClick={() => setSelectedUser(user)}
                      >
                        Chi tiết
                      </button>
                      {user.role !== 'admin' && (
                        <>
                          <button
                            className={`btn-user-lock-toggle ${user.is_locked ? 'locked' : ''}`}
                            onClick={() => handleToggleLock(user.id)}
                            title={user.is_locked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                          >
                            {user.is_locked ? <Unlock size={14} /> : <Lock size={14} />}
                          </button>
                          <button
                            className="btn-user-delete"
                            onClick={() => setShowDeleteConfirm(user.id)}
                            disabled={deletingId === user.id}
                            title="Xóa người dùng"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
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

      {/* Details Modal */}
      {selectedUser && (
        <div className="user-detail-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="user-detail-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-detail-header">
              <h2>Chi tiết thành viên</h2>
              <button className="close-modal-btn" onClick={() => setSelectedUser(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-detail-body">
              <div className="user-profile-summary">
                <div className={`user-profile-avatar-luxe ${selectedUser.is_locked ? 'avatar-locked' : ''}`}>
                  {selectedUser.is_locked ? <Lock size={24} /> : selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div className="user-profile-meta-luxe">
                  <h3>{selectedUser.name}</h3>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <span className={`role-badge ${selectedUser.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                      {selectedUser.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </span>
                    {selectedUser.is_locked && (
                      <span className="lock-badge-luxe">ĐÃ BỊ KHÓA</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="detail-info-card" style={{ marginTop: '24px' }}>
                <div className="info-row">
                  <span className="info-label">Mã thành viên</span>
                  <span className="info-value">#{selectedUser.id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Địa chỉ Email</span>
                  <span className="info-value">{selectedUser.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Số điện thoại</span>
                  <span className="info-value">{selectedUser.phone || 'Chưa cung cấp'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Ngày tham gia</span>
                  <span className="info-value">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Trạng thái tài khoản</span>
                  <span className={`info-value ${selectedUser.is_locked ? 'text-danger-luxe' : 'text-success-luxe'}`}>
                    {selectedUser.is_locked ? 'Đang bị khóa' : 'Hoạt động bình thường'}
                  </span>
                </div>
              </div>

              {selectedUser.role !== 'admin' && (
                <div className="modal-actions-luxe" style={{ marginTop: '24px' }}>
                  <button
                    className={`btn-lock-toggle ${selectedUser.is_locked ? 'btn-unlock' : 'btn-lock'}`}
                    onClick={() => {
                      handleToggleLock(selectedUser.id);
                      setSelectedUser(prev => ({ ...prev, is_locked: !prev.is_locked }));
                    }}
                  >
                    {selectedUser.is_locked ? <Unlock size={16} /> : <Lock size={16} />}
                    {selectedUser.is_locked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                  </button>

                  <button
                    className="btn-delete-member"
                    onClick={() => {
                      setShowDeleteConfirm(selectedUser.id);
                      setSelectedUser(null);
                    }}
                  >
                    <Trash2 size={16} /> Xóa tài khoản
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
