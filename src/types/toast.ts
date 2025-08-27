export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export interface ToastContextType {
  showToast: (message: string, type?: ToastProps['type'], duration?: number) => void;
}

export interface ToastItem extends ToastProps {
  id: string;
}