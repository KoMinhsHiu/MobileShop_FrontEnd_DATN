import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import styles from '../OrderManagement.module.scss';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Order Management Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <h2 className={styles.errorTitle}>Đã xảy ra lỗi</h2>
          <p className={styles.errorMessage}>
            Có lỗi xảy ra khi tải dữ liệu đơn hàng. Vui lòng thử lại sau.
          </p>
          <button 
            className={styles.retryButton}
            onClick={this.handleRetry}
          >
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
