import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              backgroundColor: t.type === 'error' ? '#fef2f2' : '#f0fdf4',
              color: t.type === 'error' ? '#991b1b' : '#166534',
              border: `1px solid ${t.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
