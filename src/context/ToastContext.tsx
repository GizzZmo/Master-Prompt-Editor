import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast, { ToastProps } from '../components/ui/Toast';

interface ToastContextType {
  showToast: (message: string, type?: ToastProps['type'], duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

interface ToastItem extends ToastProps {
  id: string;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: ToastProps['type'] = 'info', duration = 5000) => {
    const id = Date.now().toString();
    const newToast: ToastItem = {
      id,
      message,
      type,
      duration,
      onClose: () => removeToast(id),
    };

    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

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

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};