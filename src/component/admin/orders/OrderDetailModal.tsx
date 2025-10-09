import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faUser, 
  faShoppingCart, 
  faEdit,
  faSave,
  faBan,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faCreditCard,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { Order, OrderStatusOption } from '../admin.types';
import { ORDER_STATUS_OPTIONS } from '../admin.constants';
import styles from './OrderDetailModal.module.scss';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string, internalNotes?: string) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize form when order changes
  React.useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setInternalNotes(order.internalNotes || '');
    }
  }, [order]);

  if (!isOpen || !order) return null;

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
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusOption = ORDER_STATUS_OPTIONS.find(option => option.value === status);
    if (!statusOption) return null;

    return (
      <span className={`${styles.statusBadge} ${styles[status]}`}>
        <span>{statusOption.icon}</span>
        {statusOption.label}
      </span>
    );
  };

  // Get payment method badge
  const getPaymentMethodBadge = (method: string) => {
    const methodClass = method.toLowerCase().replace(/\s+/g, '');
    return (
      <span className={`${styles.paymentMethod} ${styles[methodClass]}`}>
        {method}
      </span>
    );
  };

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!order || selectedStatus === order.status) {
      onClose();
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, selectedStatus, internalNotes);
      onClose();
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculate total items
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>Chi tiết đơn hàng {order.orderNumber}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.modalContent}>
          {/* Order Info */}
          <div className={styles.orderInfo}>
            {/* Customer Info */}
            <div className={styles.infoSection}>
              <h3>
                <FontAwesomeIcon icon={faUser} />
                Thông tin khách hàng
              </h3>
              <div className={styles.customerInfo}>
                <div className={styles.customerName}>{order.customer.name}</div>
                <div className={styles.customerContact}>
                  <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px' }} />
                  {order.customer.phone}
                </div>
                <div className={styles.customerContact}>
                  <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px' }} />
                  {order.customer.email}
                </div>
                <div className={styles.customerAddress}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px' }} />
                  {order.customer.address}, {order.customer.ward}, {order.customer.district}, {order.customer.city}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className={styles.infoSection}>
              <h3>
                <FontAwesomeIcon icon={faShoppingCart} />
                Thông tin đơn hàng
              </h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Mã đơn hàng:</span>
                  <span className={styles.value}>{order.orderNumber}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Ngày đặt:</span>
                  <span className={styles.value}>{formatDate(order.orderDate)}</span>
                </div>
                {order.deliveryDate && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Ngày giao:</span>
                    <span className={styles.value}>{formatDate(order.deliveryDate)}</span>
                  </div>
                )}
                <div className={styles.infoItem}>
                  <span className={styles.label}>Phương thức thanh toán:</span>
                  <span className={styles.value}>{getPaymentMethodBadge(order.paymentMethod)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Trạng thái:</span>
                  <span className={styles.value}>{getStatusBadge(order.status)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Số lượng sản phẩm:</span>
                  <span className={styles.value}>{totalItems} sản phẩm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className={styles.orderItems}>
            <h3>
              <FontAwesomeIcon icon={faShoppingCart} />
              Sản phẩm đã đặt
            </h3>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Biến thể</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.productInfo}>
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.productName}
                            className={styles.productImage}
                          />
                        )}
                        <div className={styles.productDetails}>
                          <div className={styles.productName}>{item.productName}</div>
                        </div>
                      </div>
                    </td>
                    <td>{item.variant}</td>
                    <td className={styles.quantity}>{item.quantity}</td>
                    <td className={styles.unitPrice}>{formatCurrency(item.unitPrice)}</td>
                    <td className={styles.totalPrice}>{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div className={styles.orderSummary}>
            <div className={styles.summaryRow}>
              <span className={styles.label}>Tổng cộng:</span>
              <span className={styles.value}>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Customer Notes */}
          {order.notes && (
            <div className={styles.infoSection}>
              <h3>Ghi chú từ khách hàng</h3>
              <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                {order.notes}
              </p>
            </div>
          )}

          {/* Status Update */}
          <div className={styles.statusUpdate}>
            <h3>
              <FontAwesomeIcon icon={faEdit} />
              Cập nhật trạng thái đơn hàng
            </h3>
            <div className={styles.statusForm}>
              <div className={styles.formGroup}>
                <label>Trạng thái mới</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {ORDER_STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>Ghi chú nội bộ (tùy chọn)</label>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Nhập ghi chú nội bộ cho đơn hàng này..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.modalActions}>
            <button 
              className={`${styles.cancelBtn} btn`}
              onClick={onClose}
              disabled={isUpdating}
            >
              <FontAwesomeIcon icon={faBan} />
              Hủy
            </button>
            <button 
              className={`${styles.saveBtn} btn`}
              onClick={handleUpdateStatus}
              disabled={isUpdating || selectedStatus === order.status}
            >
              <FontAwesomeIcon icon={faSave} />
              {isUpdating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
