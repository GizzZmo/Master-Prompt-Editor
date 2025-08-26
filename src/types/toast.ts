import { ToastProps } from '../components/ui/Toast';

export interface ToastContextType {
  showToast: (message: string, type?: ToastProps['type'], duration?: number) => void;
}

export interface ToastItem extends ToastProps {
  id: string;
}