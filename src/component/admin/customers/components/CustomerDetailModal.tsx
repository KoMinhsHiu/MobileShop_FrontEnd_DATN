import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faEnvelope, faPhone, faMapMarkerAlt, faShoppingCart, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { Customer } from '../../admin.types';
import { formatCurrency, formatDate, getRoleIcon, getRoleLabel, getStatusLabel } from '../constants/customerConstants';
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

  const getOrderStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'Chờ xử lý',
      shipping: 'Đang giao',
      completed: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getOrderStatusClass = (status: string) => {
    return styles[status] || styles.pending;
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>
            {customer.avatar ? (
              <img 
                src={customer.avatar} 
                alt={customer.name}
                className={styles.customerAvatar}
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
                  <span className={styles.label}>Họ tên</span>
                  <span className={styles.value}>{customer.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email</span>
                  <a 
                    href={`mailto:${customer.email}`}
                    className={`${styles.value} ${styles.email}`}
                  >
                    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '6px' }} />
                    {customer.email}
                  </a>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Số điện thoại</span>
                  <span className={`${styles.value} ${styles.phone}`}>
                    <FontAwesomeIcon icon={faPhone} style={{ marginRight: '6px' }} />
                    {customer.phone}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Quyền</span>
                  <span className={styles.value}>
                    {getRoleIcon(customer.role)} {getRoleLabel(customer.role)}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Trạng thái</span>
                  <span className={styles.value}>
                    {customer.status === 'active' ? '✅' : '🔒'} {getStatusLabel(customer.status)}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Ngày tạo</span>
                  <span className={styles.value}>{formatDate(customer.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Address & Stats */}
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px' }} />
                Địa chỉ & Thống kê
              </h3>
              
              {/* Address */}
              {customer.address && (
                <div className={styles.infoGrid} style={{ marginBottom: '20px' }}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Địa chỉ</span>
                    <span className={styles.value}>
                      {customer.address.street}, {customer.address.ward}, {customer.address.district}, {customer.address.city}
                    </span>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className={styles.statsSection}>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>
                      <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: '8px' }} />
                      {customer.orderCount || 0}
                    </div>
                    <div className={styles.statLabel}>Đơn hàng</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>
                      <FontAwesomeIcon icon={faDollarSign} style={{ marginRight: '8px' }} />
                      {formatCurrency(customer.totalSpent || 0)}
                    </div>
                    <div className={styles.statLabel}>Tổng chi tiêu</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Orders History */}
          <div className={styles.ordersSection}>
            <h3 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: '8px' }} />
              Lịch sử đơn hàng
            </h3>
            
            {customer.orders && customer.orders.length > 0 ? (
              <table className={styles.ordersTable}>
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Ngày đặt</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <span className={styles.orderNumber}>
                          {order.orderNumber}
                        </span>
                      </td>
                      <td>
                        <span className={styles.orderDate}>
                          {formatDate(order.orderDate)}
                        </span>
                      </td>
                      <td>
                        <span className={styles.orderAmount}>
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.orderStatus} ${getOrderStatusClass(order.status)}`}>
                          {getOrderStatusLabel(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.noOrders}>
                <div className={styles.noOrdersIcon}>📦</div>
                <p>Khách hàng chưa có đơn hàng nào</p>
              </div>
            )}
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
