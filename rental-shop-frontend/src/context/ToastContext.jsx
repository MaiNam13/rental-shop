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
    // Duration changed to 5 seconds (5000ms)
    setTimeout(() => removeToast(id), 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '110px', // Placed perfectly below the luxury header Navbar
        right: '30px', // Top-right corner
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '380px',
        pointerEvents: 'none' // Allow click-through on empty wrapper areas
      }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: '16px 24px 20px 24px', // Extra padding bottom to give space for progress bar
              borderRadius: '12px',
              backgroundColor: '#ffffff', // Clean white background
              color: '#08060d', // Deep rich black text for high contrast
              borderLeft: `4px solid ${t.type === 'error' ? '#ef4444' : '#D4AF37'}`, // Gold for success/normal, Red for error
              boxShadow: '0 20px 40px rgba(8, 6, 13, 0.12), 0 4px 12px rgba(8, 6, 13, 0.06)', // Deep, highly prominent luxury drop shadow
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '0.3px',
              lineHeight: '1.4',
              position: 'relative', // Required for absolute progress bar positioning
              overflow: 'hidden', // Clip progress bar edges
              pointerEvents: 'auto', // Allow interaction with toast itself
              animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {t.message}
            {/* Elegant timer progress bar */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '2px',
                backgroundColor: t.type === 'error' ? '#ef4444' : '#D4AF37',
                animation: 'toastProgress 5s linear forwards'
              }}
            />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
