import React from 'react';
import { Warehouse, Construction } from 'lucide-react';
import './PlaceholderPage.css';

const InventoryPage = () => {
  return (
    <div className="placeholder-page-container">
      <div className="placeholder-icon-wrapper">
        <Warehouse size={64} strokeWidth={1.5} />
      </div>
      <h1 className="placeholder-title">Quản lý kho hàng</h1>
      <p className="placeholder-text">
        Tính năng theo dõi tồn kho chi tiết và cảnh báo nhập hàng đang được phát triển để mang lại trải nghiệm quản lý tối ưu nhất.
      </p>
      <div className="coming-soon-badge">
        <Construction size={20} />
        Sắp ra mắt
      </div>
    </div>
  );
};

export default InventoryPage;
