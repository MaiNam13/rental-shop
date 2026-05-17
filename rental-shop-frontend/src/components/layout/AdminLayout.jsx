import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  CalendarRange, 
  CreditCard, 
  Users, 
  Warehouse, 
  BarChart3, 
  Settings, 
  Search, 
  Plus, 
  Bell, 
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/AdminDashboard.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.admin-profile-dropdown-wrapper')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navGroups = [
    {
      title: 'Quản lý',
      items: [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Tổng quan' },
        { path: '/admin/products', icon: <Package size={20} />, label: 'Sản phẩm' },
        { path: '/admin/categories', icon: <Tags size={20} />, label: 'Danh mục' },
        { path: '/admin/rentals', icon: <CalendarRange size={20} />, label: 'Đơn thuê' },
        { path: '/admin/payments', icon: <CreditCard size={20} />, label: 'Thanh toán' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Người dùng' },
        { path: '/admin/inventory', icon: <Warehouse size={20} />, label: 'Kho hàng' },
        { path: '/admin/reports', icon: <BarChart3 size={20} />, label: 'Hạn thuê đồ' },
      ]
    },
    {
      title: 'Hệ thống',
      items: [
        { path: '/admin/settings', icon: <Settings size={20} />, label: 'Cài đặt' },
      ]
    }
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">LF</div>
          <div className="logo-text">
            <h3>LuxFashion</h3>
            <p>Quản trị viên</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="nav-section">
              <h4 className="section-title">{group.title}</h4>
              {group.items.map((item, iIdx) => (
                <NavLink 
                  key={iIdx} 
                  to={item.path} 
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  end={item.path === '/admin'}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-detailed">
            <img 
              src={user?.avatar || "https://i.pravatar.cc/150?u=admin"} 
              alt="Admin" 
              className="footer-avatar"
            />
            <div className="footer-user-info">
              <h4>{user?.name || "Nguyễn Quản Trị"}</h4>
              <p>Quản trị viên cấp cao</p>
            </div>
            <button className="footer-logout-btn" onClick={handleLogout}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-left-section">
            <div className="header-breadcrumbs">Tổng quan › <span className="active">Sản phẩm</span></div>
            <div className="header-search">
              <Search size={16} color="#aaa" />
              <input type="text" placeholder="Tìm kiếm nhanh..." />
            </div>
          </div>

          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>

            <div className="admin-profile-dropdown-wrapper">
              <button 
                className={`admin-profile-btn ${showProfileMenu ? 'active' : ''}`}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <img src={user?.avatar || "https://i.pravatar.cc/150?u=admin"} alt="Profile" />
                <span>{user?.name || "Admin"}</span>
                <ChevronDown size={16} className={`chevron-icon ${showProfileMenu ? 'rotated' : ''}`} />
              </button>

              {showProfileMenu && (
                <div className="admin-profile-dropdown-menu">
                  <div className="dropdown-user-header">
                    <h4>{user?.name || "Nguyễn Quản Trị"}</h4>
                    <p>{user?.email || "admin@gmail.com"}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item-luxe logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
