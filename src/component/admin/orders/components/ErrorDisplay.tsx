import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faRefresh } from '@fortawesome/free-solid-svg-icons';
import styles from '../OrderManagement.module.scss';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Đã xảy ra lỗi',
  message = 'Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.',
  onRetry,
  showRetry = true
}) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>
        <FontAwesomeIcon icon={faExclamationTriangle} />
      </div>
      <h2 className={styles.errorTitle}>{title}</h2>
      <p className={styles.errorMessage}>{message}</p>
      {showRetry && onRetry && (
        <button 
          className={styles.retryButton}
          onClick={onRetry}
          aria-label="Thử lại"
        >
          <FontAwesomeIcon icon={faRefresh} />
          Thử lại
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
