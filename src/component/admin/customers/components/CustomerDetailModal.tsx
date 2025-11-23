import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faUser, 
  faEnvelope, 
  faPhone, 
  faCalendarAlt, 
  faVenusMars, 
  faCoins, 
  faUserTag,
  faShieldAlt,
  faBirthdayCake,
  faKey
} from '@fortawesome/free-solid-svg-icons';
import { Customer } from '../../admin.types';
import { formatDate, getStatusLabel } from '../constants/customerConstants';
import styles from '../CustomerDetailModal.module.scss';

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose
}) => {
  if (!isOpen || !customer) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatGender = (gender: string) => {
    const genderMap: { [key: string]: string } = {
      male: '👨 Nam',
      female: '👩 Nữ',
      other: '👤 Khác'
    };
    return genderMap[gender] || '👤 Không xác định';
  };

  const formatDateOfBirth = (dateString: string) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    const iconMap: { [key: string]: string } = {
      active: '✅',
      inactive: '🔒',
      banned: '🚫'
    };
    return iconMap[status] || '❓';
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>
            {customer.avatar ? (
              <Image
                src={customer.avatar}
                alt={customer.name}
                className={styles.customerAvatar}
                width={48}
                height={48}
                priority
                unoptimized={customer.avatar.startsWith('http')}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                👤
              </div>
            )}
            {customer.name}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Customer Information */}
          <div className={styles.customerInfo}>
            {/* Personal Info */}
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                Thông tin cá nhân
              </h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '6px' }} />
                    Họ tên
                  </span>
                  <span className={styles.value}>{customer.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>
                    <FontAwesomeIcon icon={faUserTag} style={{ marginRight: '6px' }} />
                    Tên đăng nhập
                  </span>
                  <span className={styles.value}>{customer.username || 'Chưa cập nhật'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>
                    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '6px' }} />
                    Email
                  </span>
                  <span className={styles.value}>
                    {customer.email}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>
                    <FontAwesomeIcon icon={faPhone} style={{ marginRight: '6px' }} />
                    Số điện thoại
                  </span>
                  <span className={`${styles.value} ${styles.phone}`}>
                    {customer.phone || 'Chưa cập nhật'}
                  </span>
                </div>
                {customer.gender && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>
                      <FontAwesomeIcon icon={faVenusMars} style={{ marginRight: '6px' }} />
                      Giới tính
                    </span>
                    <span className={styles.value}>{formatGender(customer.gender)}</span>
                  </div>
                )}
                {customer.dateOfBirth && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>
                      <FontAwesomeIcon icon={faBirthdayCake} style={{ marginRight: '6px' }} />
                      Ngày sinh
                    </span>
                    <span className={styles.value}>{formatDateOfBirth(customer.dateOfBirth)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>
                <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: '8px' }} />
                Thông tin bổ sung
              </h3>
              
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>
                    <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: '6px' }} />
                    Trạng thái tài khoản
                  </span>
                  <span className={`${styles.value} ${styles.statusValue}`}>
                    <span className={`${styles.statusBadge} ${styles[customer.status]}`}>
                      {getStatusIcon(customer.status)} {getStatusLabel(customer.status)}
                    </span>
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '6px' }} />
                    Ngày tạo tài khoản
                  </span>
                  <span className={styles.value}>{formatDate(customer.createdAt)}</span>
                </div>
                {typeof customer.pointsBalance === 'number' && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>
                      <FontAwesomeIcon icon={faCoins} style={{ marginRight: '6px' }} />
                      Điểm tích lũy
                    </span>
                    <span className={`${styles.value} ${styles.points}`}>
                      {customer.pointsBalance.toLocaleString('vi-VN')} điểm
                    </span>
                  </div>
                )}
                {customer.lastChangePass && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>
                      <FontAwesomeIcon icon={faKey} style={{ marginRight: '6px' }} />
                      Lần cuối đổi mật khẩu
                    </span>
                    <span className={`${styles.value} ${styles.lastChangePass}`}>{formatDate(customer.lastChangePass)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={`${styles.btn} ${styles['btn-secondary']}`} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;
