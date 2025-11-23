import { useState, useCallback } from 'react';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Toast notification interface
 */
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface UseToastReturn {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================

/**
 * Custom hook for managing toast notifications
 * @returns Toast management functions and state
 */
export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /**
   * Remove a toast notification by ID
   */
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * Add a new toast notification
   */
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [removeToast]);

  /**
   * Show success toast
   */
  const showSuccess = useCallback((message: string) => {
    addToast({ message, type: 'success' });
  }, [addToast]);

  /**
   * Show error toast
   */
  const showError = useCallback((message: string) => {
    addToast({ message, type: 'error' });
  }, [addToast]);

  /**
   * Show warning toast
   */
  const showWarning = useCallback((message: string) => {
    addToast({ message, type: 'warning' });
  }, [addToast]);

  /**
   * Show info toast
   */
  const showInfo = useCallback((message: string) => {
    addToast({ message, type: 'info' });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
