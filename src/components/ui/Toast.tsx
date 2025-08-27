import React, { useState, useEffect, useMemo } from 'react';
import { ToastProps } from '../../types/toast';

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  // Memoize styles for better performance
  const toastStyles = useMemo(() => {
    const baseStyles = {
      position: 'fixed' as const,
      top: '20px',
      right: '20px',
      padding: '12px 16px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: 1000,
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      animation: 'slideIn 0.3s ease-out',
    };

    const typeStyles = {
      success: { backgroundColor: '#10B981' },
      error: { backgroundColor: '#EF4444' },
      warning: { backgroundColor: '#F59E0B' },
      info: { backgroundColor: '#3B82F6' },
    };

    return { ...baseStyles, ...typeStyles[type] };
  }, [type]);

  // Memoize icon for better performance  
  const icon = useMemo(() => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  }, [type]);

  if (!isVisible) return null;

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={toastStyles}>
        <span aria-hidden="true">{icon}</span>
        <span>{message}</span>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            marginLeft: 'auto',
            fontSize: '16px',
            padding: '0',
          }}
          aria-label="Close notification"
          type="button"
        >
          ×
        </button>
      </div>
    </>
  );
};

export default Toast;