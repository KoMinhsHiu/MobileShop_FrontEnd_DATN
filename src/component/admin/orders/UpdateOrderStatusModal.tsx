import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faEdit,
  faSave,
  faBan
} from '@fortawesome/free-solid-svg-icons';
import { Order } from '../admin.types';
import { ORDER_STATUS_OPTIONS } from './constants/orderConstants';
import styles from './UpdateOrderStatusModal.module.scss';
import ordersAPI from '@/utils/api/orders';

interface UpdateOrderStatusModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string, internalNotes?: string) => void;
}

const UpdateOrderStatusModal: React.FC<UpdateOrderStatusModalProps> = ({
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

  // Get allowed status transitions based on current status
  const getAllowedStatusOptions = (currentStatus: string, paymentMethod: string) => {
    switch (currentStatus) {
      case 'pending':
        const baseOptions = paymentMethod.toLowerCase() === 'cod'
            ? ['processing', 'canceled', 'failed']
            : ['paid', 'canceled', 'failed'];
        return ORDER_STATUS_OPTIONS.filter(option => baseOptions.includes(option.value));
      
      case 'paid':
        return ORDER_STATUS_OPTIONS.filter(option => ['processing', 'failed'].includes(option.value));
      
      case 'processing':
        return ORDER_STATUS_OPTIONS.filter(option => ['shipped', 'failed'].includes(option.value));
      
      case 'shipped':
        return ORDER_STATUS_OPTIONS.filter(option => ['delivered', 'failed'].includes(option.value));
      
      case 'canceled':
      case 'delivered':
      case 'failed':
        return []; // Không cho phép đổi trạng thái
      
      default:
        return ORDER_STATUS_OPTIONS;
    }
  };

  const allowedStatusOptions = getAllowedStatusOptions(order.status, order.paymentMethod);
  const canChangeStatus = allowedStatusOptions.length > 0;

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

  const handleClose = () => {
    if (!isUpdating) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>
            <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} />
            Cập nhật trạng thái đơn hàng
          </h2>
          <button className={styles.closeBtn} onClick={handleClose} disabled={isUpdating}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.modalContent}>
          {/* Current Status Display */}
          <div className={styles.currentStatusSection}>
            <h3>Trạng thái hiện tại</h3>
            <div className={styles.statusDisplay}>
              <div className={styles.orderInfo}>
                <span className={styles.orderNumber}>{order.orderNumber}</span>
                <span className={styles.customerName}>{order.customer.name}</span>
              </div>
              <div className={styles.statusBadgeContainer}>
                <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                  {ORDER_STATUS_OPTIONS.find(opt => opt.value === order.status)?.icon}
                  {ORDER_STATUS_OPTIONS.find(opt => opt.value === order.status)?.label}
                </span>
              </div>
            </div>
          </div>

          {/* Status Update Section */}
          {canChangeStatus ? (
            <div className={styles.statusUpdateSection}>
              <h3>Chuyển đổi trạng thái</h3>
              <div className={styles.statusForm}>
                <div className={styles.formGroup}>
                  <label>Chọn trạng thái mới</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={isUpdating}
                  >
                    <option value={order.status} disabled>
                      -- Chọn trạng thái mới --
                    </option>
                    {allowedStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.noChangeSection}>
              <div className={styles.noChangeMessage}>
                <span className={styles.icon}>🔒</span>
                <h3>Không thể thay đổi trạng thái</h3>
                <p>Đơn hàng với trạng thái <strong>{ORDER_STATUS_OPTIONS.find(opt => opt.value === order.status)?.label}</strong> không thể thay đổi trạng thái.</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={styles.modalActions}>
            <button 
              className={`${styles.cancelBtn} btn`}
              onClick={handleClose}
              disabled={isUpdating}
            >
              <FontAwesomeIcon icon={faBan} />
              {canChangeStatus ? 'Hủy' : 'Đóng'}
            </button>
            {canChangeStatus && (
              <button 
                className={`${styles.saveBtn} btn`}
                onClick={handleUpdateStatus}
                disabled={isUpdating || selectedStatus === order.status}
              >
                <FontAwesomeIcon icon={faSave} />
                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrderStatusModal;
