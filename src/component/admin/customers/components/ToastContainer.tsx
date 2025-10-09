import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheckCircle, faExclamationTriangle, faInfoCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Toast } from '../hooks/useToast';
import styles from '../Toast.module.scss';

interface ToastContainerProps {
  toasts: Toast[];
  onRemoveToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast
}) => {
  const getToastIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faExclamationCircle;
      case 'warning':
        return faExclamationTriangle;
      case 'info':
        return faInfoCircle;
      default:
        return faInfoCircle;
    }
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <FontAwesomeIcon 
            icon={getToastIcon(toast.type)} 
            className={styles.toastIcon} 
          />
          <div className={styles.toastContent}>
            <p className={styles.toastMessage}>{toast.message}</p>
          </div>
          <button
            className={styles.toastClose}
            onClick={() => onRemoveToast(toast.id)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          {toast.duration && toast.duration > 0 && (
            <div className={styles.toastProgress} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
