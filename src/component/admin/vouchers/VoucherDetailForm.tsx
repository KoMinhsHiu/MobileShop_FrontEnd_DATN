import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faTicket,
  faCalendar,
  faPercent,
  faDollarSign,
  faGlobe,
  faTag,
  faCreditCard,
  faUsers,
  faInfo,
  faListAlt,
  faMoneyBill
} from '@fortawesome/free-solid-svg-icons';
import { Voucher } from '@/utils/api/voucher';
import styles from './VoucherForm.module.scss';

interface VoucherDetailFormProps {
  voucher: Voucher | null;
  isOpen: boolean;
  onClose: () => void;
}

const VoucherDetailForm: React.FC<VoucherDetailFormProps> = ({
  voucher,
  isOpen,
  onClose
}) => {
  if (!isOpen || !voucher) return null;

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Get voucher status
  const getVoucherStatus = () => {
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = voucher.endDate ? new Date(voucher.endDate) : null;
    
    if (startDate > now) {
      return { status: 'upcoming', label: 'Sắp diễn ra', className: 'upcoming' };
    }
    
    if (endDate && now > endDate) {
      return { status: 'expired', label: 'Đã hết hạn', className: 'expired' };
    }
    
    return { status: 'active', label: 'Đang hoạt động', className: 'active' };
  };

  // Get discount type display
  const getDiscountTypeDisplay = () => {
    return voucher.discountType === 'percent' 
      ? { icon: faPercent, label: 'Giảm theo phần trăm' }
      : { icon: faDollarSign, label: 'Giảm theo số tiền' };
  };

  // Get applies to display
  const getAppliesToDisplay = () => {
    switch (voucher.appliesTo) {
      case 'all': 
        return { icon: faGlobe, label: 'Tất cả sản phẩm' };
      case 'category': 
        return { icon: faTag, label: 'Danh mục' };
      case 'payment_method': 
        return { icon: faCreditCard, label: 'Phương thức thanh toán' };
      default: 
        return { icon: faGlobe, label: voucher.appliesTo };
    }
  };

  // Format discount value
  const formatDiscountValue = () => {
    if (voucher.discountType === 'percent') {
      return `${voucher.discountValue}%`;
    }
    return formatCurrency(voucher.discountValue);
  };

  const voucherStatus = getVoucherStatus();
  const discountTypeInfo = getDiscountTypeDisplay();
  const appliesToInfo = getAppliesToDisplay();

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>
            <FontAwesomeIcon icon={faTicket} style={{ marginRight: '12px', color: '#8b5cf6' }} />
            Chi tiết Voucher: {voucher.code}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.modalContent}>
          {/* Basic Voucher Info */}
          <div className={styles.voucherInfo}>
            {/* General Info */}
            <div className={styles.infoSection}>
              <h3>
                <FontAwesomeIcon icon={faInfo} />
                Thông tin cơ bản
              </h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Mã voucher:</span>
                  <span className={styles.value}>
                    <code className={styles.voucherCode}>{voucher.code}</code>
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Tiêu đề:</span>
                  <span className={styles.value}>{voucher.title}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Mô tả:</span>
                  <span className={styles.value}>{voucher.description}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Trạng thái:</span>
                  <span className={styles.value}>
                    <span className={`${styles.statusBadge} ${styles[voucherStatus.className]}`}>
                      {voucherStatus.label}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Discount Info */}
            <div className={styles.infoSection}>
              <h3>
                <FontAwesomeIcon icon={discountTypeInfo.icon} />
                Thông tin giảm giá
              </h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Loại giảm giá:</span>
                  <span className={styles.value}>
                    <FontAwesomeIcon 
                      icon={discountTypeInfo.icon} 
                      style={{ marginRight: '8px', color: '#059669' }}
                    />
                    {discountTypeInfo.label}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Giá trị giảm:</span>
                  <span className={`${styles.value} ${styles.highlight}`}>
                    {formatDiscountValue()}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Giá trị đơn hàng tối thiểu:</span>
                  <span className={styles.value}>
                    {formatCurrency(voucher.minOrderValue)}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Giảm tối đa:</span>
                  <span className={styles.value}>
                    {formatCurrency(voucher.maxDiscountValue)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Usage and Time Info */}
          <div className={styles.usageTimeInfo}>
            {/* Usage Info */}
            <div className={styles.infoSection}>
              <h3>
                <FontAwesomeIcon icon={faUsers} />
                Thông tin sử dụng
              </h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Giới hạn sử dụng:</span>
                  <span className={styles.value}>
                    {voucher.usageLimit === -1 ? 'Không giới hạn' : voucher.usageLimit.toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Giới hạn mỗi người:</span>
                  <span className={styles.value}>
                    {voucher.usageLimitPerUser === -1 ? 'Không giới hạn' : voucher.usageLimitPerUser.toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Đã sử dụng:</span>
                  <span className={styles.value}>
                    <span className={styles.usageCount}>{voucher.usedCount.toLocaleString('vi-VN')}</span>
                    {voucher.usageLimit > 0 && (
                      <span className={styles.usagePercent}>
                        ({Math.round((voucher.usedCount / voucher.usageLimit) * 100)}%)
                      </span>
                    )}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Còn lại:</span>
                  <span className={styles.value}>
                    {voucher.usageLimit === -1 
                      ? 'Không giới hạn' 
                      : (voucher.usageLimit - voucher.usedCount).toLocaleString('vi-VN')
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Time Info */}
            <div className={styles.infoSection}>
              <h3>
                <FontAwesomeIcon icon={faCalendar} />
                Thông tin thời gian
              </h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Ngày bắt đầu:</span>
                  <span className={styles.value}>{formatDate(voucher.startDate)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Ngày kết thúc:</span>
                  <span className={styles.value}>
                    {voucher.endDate ? formatDate(voucher.endDate) : 'Không giới hạn'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Ngày tạo:</span>
                  <span className={styles.value}>{formatDateTime(voucher.createdAt)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Cập nhật cuối:</span>
                  <span className={styles.value}>{formatDateTime(voucher.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Applies To Info */}
          <div className={styles.appliesInfo}>
            <div className={styles.infoSection}>
              <h3>
                <FontAwesomeIcon icon={appliesToInfo.icon} />
                Phạm vi áp dụng
              </h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Áp dụng cho: {appliesToInfo.label}</span>
                </div>
              </div>

              {/* Conditional Category Display */}
              {voucher.appliesTo === 'category' && voucher.categories && voucher.categories.length > 0 && (
                <div className={styles.conditionalSection}>
                  <h4>
                    <FontAwesomeIcon icon={faListAlt} />
                    Danh mục áp dụng
                  </h4>
                  <div className={styles.categoryList}>
                    {voucher.categories.map((voucherCategory, index) => (
                      <span key={index} className={styles.categoryItem}>
                        <FontAwesomeIcon icon={faTag} />
                        {voucherCategory.category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Conditional Payment Method Display */}
              {voucher.appliesTo === 'payment_method' && voucher.paymentMethods && voucher.paymentMethods.length > 0 && (
                <div className={styles.conditionalSection}>
                  <h4>
                    <FontAwesomeIcon icon={faMoneyBill} />
                    Phương thức thanh toán áp dụng
                  </h4>
                  <div className={styles.paymentMethodList}>
                    {voucher.paymentMethods.map((voucherPaymentMethod, index) => (
                      <span key={index} className={styles.paymentMethodItem}>
                        <FontAwesomeIcon icon={faCreditCard} />
                        {voucherPaymentMethod.paymentMethod.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className={styles.modalActions}>
            <button 
              className={`${styles.cancelBtn} btn`}
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherDetailForm;