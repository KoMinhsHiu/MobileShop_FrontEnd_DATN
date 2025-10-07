import React from 'react';
import styles from './additionalOptions.module.scss';

interface AdditionalOptionsProps {
  onViewHistory?: () => void;
  onManagePayment?: () => void;
}

const AdditionalOptions: React.FC<AdditionalOptionsProps> = ({
  onViewHistory,
  onManagePayment
}) => {
  return (
    <div className={styles.additionalOptions}>
      <h3>Tùy chọn bổ sung</h3>
      <div className={styles.optionsGrid}>
        <div className={styles.optionCard}>
          <div className={styles.optionIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#28a745"/>
            </svg>
          </div>
          <h4>Lịch sử đăng nhập</h4>
          <p>Xem lịch sử đăng nhập và hoạt động gần đây</p>
          <button 
            className={styles.optionButton}
            onClick={onViewHistory}
          >
            Xem lịch sử
          </button>
        </div>
        
        <div className={styles.optionCard}>
          <div className={styles.optionIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="#007bff"/>
            </svg>
          </div>
          <h4>Phương thức thanh toán</h4>
          <p>Quản lý các phương thức thanh toán đã lưu</p>
          <button 
            className={styles.optionButton}
            onClick={onManagePayment}
          >
            Quản lý
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalOptions;
