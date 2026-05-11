import React from 'react';

const RentalDatePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="rental-date-picker" style={{ marginBottom: '20px' }}>
      <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Thời gian thuê:</p>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Ngày nhận:</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => onStartDateChange(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Ngày trả:</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => onEndDateChange(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
      </div>
    </div>
  );
};

export default RentalDatePicker;
