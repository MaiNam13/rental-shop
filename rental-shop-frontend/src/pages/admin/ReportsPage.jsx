import React from 'react';
import { BarChart3, Construction } from 'lucide-react';
import './PlaceholderPage.css';

const ReportsPage = () => {
  return (
    <div className="placeholder-page-container">
      <div className="placeholder-icon-wrapper">
        <BarChart3 size={64} strokeWidth={1.5} />
      </div>
      <h1 className="placeholder-title">Báo cáo & Phân tích</h1>
      <p className="placeholder-text">
        Hệ thống báo cáo chuyên sâu về doanh thu, khách hàng và xu hướng thị trường sẽ sớm được cập nhật.
      </p>
      <div className="coming-soon-badge">
        <Construction size={20} />
        Sắp ra mắt
      </div>
    </div>
  );
};

export default ReportsPage;
