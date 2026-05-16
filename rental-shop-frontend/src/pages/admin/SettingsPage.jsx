import React from 'react';
import { Settings, Construction } from 'lucide-react';
import './PlaceholderPage.css';

const SettingsPage = () => {
  return (
    <div className="placeholder-page-container">
      <div className="placeholder-icon-wrapper">
        <Settings size={64} strokeWidth={1.5} />
      </div>
      <h1 className="placeholder-title">Cài đặt hệ thống</h1>
      <p className="placeholder-text">
        Cấu hình các tham số hệ thống, quyền hạn và tùy chỉnh giao diện sẽ có mặt trong phiên bản tới.
      </p>
      <div className="coming-soon-badge">
        <Construction size={20} />
        Sắp ra mắt
      </div>
    </div>
  );
};

export default SettingsPage;
