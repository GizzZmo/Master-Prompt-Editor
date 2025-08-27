import { useState, ReactNode, useCallback } from 'react';
import Toast from '../components/ui/Toast';
import { ToastItem } from '../types/toast';
import { ToastContext } from './toastContextHelpers';

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastItem['type'] = 'info', duration = 5000) => {
    // Use crypto.randomUUID if available, fallback to timestamp-based ID
    const id = crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastItem = {
      id,
      message,
      type,
      duration,
      onClose: () => removeToast(id),
    };

    setToasts(prev => [...prev, newToast]);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div>
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              position: 'fixed',
              top: `${20 + index * 80}px`,
              right: '20px',
              zIndex: 1000,
            }}
          >
            <Toast {...toast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};