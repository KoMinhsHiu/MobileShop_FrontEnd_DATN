import React from 'react';
import styles from '../OrderManagement.module.scss';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message = 'Đang tải...' 
}) => {
  const sizeClasses = {
    small: styles.spinnerSmall,
    medium: styles.spinnerMedium,
    large: styles.spinnerLarge
  };

  return (
    <div className={styles.loadingContainer}>
      <div className={`${styles.spinner} ${sizeClasses[size]}`} />
      {message && <p className={styles.loadingMessage}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
