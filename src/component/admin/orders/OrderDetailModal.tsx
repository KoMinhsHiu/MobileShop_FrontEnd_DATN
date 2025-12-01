import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faUser, 
  faShoppingCart, 
  faMapMarkerAlt,
  faPhone,
  faTruck,
  faCreditCard
} from '@fortawesome/free-solid-svg-icons';
import { Order } from '../admin.types';
import { ORDER_STATUS_OPTIONS } from './constants/orderConstants';
import styles from './OrderDetailModal.module.scss';
import { formatCurrency } from '../admin.utils';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  if (!isOpen || !order) return null;


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

  // Format compact date (YYYYMMDDHHmmss format)
  const formatCompactDateTime = (compactDateString: string): string => {
    if (!compactDateString || compactDateString.length !== 14) {
      return compactDateString; // Return original if invalid format
    }

    try {
      // Extract components from YYYYMMDDHHmmss
      const year = compactDateString.substring(0, 4);
      const month = compactDateString.substring(4, 6);
      const day = compactDateString.substring(6, 8);
      const hour = compactDateString.substring(8, 10);
      const minute = compactDateString.substring(10, 12);
      const second = compactDateString.substring(12, 14);

      // Create date object
      const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return compactDateString; // Return original if invalid
      }

      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting compact date:', error);
      return compactDateString; // Return original on error
    }
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
                <div className={styles.customerAddress}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px' }} />
                  {order.customer.address}
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

          {/* Payment and Shipping Info */}
          <div className={styles.paymentShippingInfo}>
            {/* Payment Info */}
            <div className={styles.infoSection}>
              <h3>
                <FontAwesomeIcon icon={faCreditCard} />
                Thông tin thanh toán
              </h3>
              {order.payments && order.payments.length > 0 ? (
                <div className={styles.infoGrid}>
                  {order.payments.map((payment, index) => (
                    <div key={payment.id}>
                      {index > 0 && <div className={styles.divider} />}
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Mã giao dịch:</span>
                        <span className={styles.value}>{payment.transactionId}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Trạng thái:</span>
                        <span className={`${styles.value} ${styles.paymentStatus} ${styles[payment.status]}`}>
                          {payment.status === 'pending' && '⏳ Chờ thanh toán'}
                          {payment.status === 'completed' && '✅ Đã thanh toán'}
                          {payment.status === 'failed' && '❌ Thất bại'}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Số tiền:</span>
                        <span className={styles.value}>{formatCurrency(payment.amount)}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Phương thức:</span>
                        <span className={styles.value}>{payment.paymentMethod.name}</span>
                      </div>
                      {payment.payDate && (
                        <div className={styles.infoItem}>
                          <span className={styles.label}>Ngày thanh toán:</span>
                          <span className={styles.value}>{formatCompactDateTime(payment.payDate)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noInfo}>
                  <span>Không có thông tin thanh toán</span>
                </div>
              )}
            </div>

            {/* Shipping Info */}
            <div className={styles.infoSection}>
              <h3>
                <FontAwesomeIcon icon={faTruck} />
                Thông tin giao hàng
              </h3>
              {order.shipments && order.shipments.length > 0 ? (
                <div className={styles.infoGrid}>
                  {order.shipments.map((shipment, index) => (
                    <div key={shipment.id}>
                      {index > 0 && <div className={styles.divider} />}
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Nhà vận chuyển:</span>
                        <span className={styles.value}>{shipment.provider}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Mã vận đơn:</span>
                        <span className={styles.value}>{shipment.trackingCode}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Trạng thái:</span>
                        <span className={`${styles.value} ${styles.shipmentStatus} ${styles[shipment.status]}`}>
                          {shipment.status === 'pending' && '⏳ Chờ xử lý'}
                          {shipment.status === 'processing' && '📦 Đang chuẩn bị'}
                          {shipment.status === 'delivered' && '✅ Đã giao'}
                          {shipment.status === 'canceled' && '❌ Đã hủy'}
                          {shipment.status === 'failed' && '⚠️ Thất bại'}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Phí vận chuyển:</span>
                        <span className={styles.value}>{formatCurrency(shipment.fee)}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Ngày giao dự kiến:</span>
                        <span className={styles.value}>{formatDate(shipment.estimatedDeliveryDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noInfo}>
                  <span>Không có thông tin giao hàng</span>
                </div>
              )}
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
                          <Image
                            src={item.image}
                            alt={item.productName}
                            className={styles.productImage}
                            width={48}
                            height={48}
                            priority
                            unoptimized={item.image.startsWith('http')}
                          />
                        )}
                        <div className={styles.productDetails}>
                          <div className={styles.productName}>{item.productName} {item.variant} - {item.color}</div>
                        </div>
                      </div>
                    </td>
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
            <div className={styles.summaryRow}>
              <span className={styles.label}>Giảm giá:</span>
              <span className={styles.value}>{formatCurrency(order.discountAmount)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.label}>Phí vận chuyển:</span>
              <span className={styles.value}>{formatCurrency(order.shippingFee)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.label}>Tổng thanh toán:</span>
              <span className={styles.value}>{formatCurrency(order.finalAmount)}</span>
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

          {/* Status History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className={styles.statusHistory}>
              <h3>Lịch sử trạng thái</h3>
              <div className={styles.historyTimeline}>
                {order.statusHistory
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((history, index) => {
                    const statusOption = ORDER_STATUS_OPTIONS.find(option => option.value === history.status);
                    return (
                      <div key={history.id} className={styles.historyItem}>
                        <div className={styles.historyIcon}>
                          <div className={`${styles.statusIcon} ${styles[history.status]}`}>
                            {statusOption?.icon || '📋'}
                          </div>
                          {index < order.statusHistory!.length - 1 && <div className={styles.historyLine} />}
                        </div>
                        <div className={styles.historyContent}>
                          <div className={styles.historyHeader}>
                            <span className={styles.statusLabel}>
                              {statusOption?.label || history.status}
                            </span>
                            <span className={styles.historyDate}>
                              {formatDateTime(history.createdAt)}
                            </span>
                          </div>
                          {history.note && (
                            <div className={styles.historyNote}>
                              {history.note}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

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

export default OrderDetailModal;
