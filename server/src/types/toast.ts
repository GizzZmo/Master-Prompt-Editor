// Toast type definitions for server-side use
export interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface ToastContextType {
  showToast: (message: string, type?: ToastProps['type'], duration?: number) => void;
}

export interface ToastItem extends ToastProps {
  id: string;
}