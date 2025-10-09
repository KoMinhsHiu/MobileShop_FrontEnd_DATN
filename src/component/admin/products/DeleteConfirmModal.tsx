import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle,
  faTimes,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { Product } from '../admin.types';
import styles from './DeleteConfirmModal.module.scss';

interface DeleteConfirmModalProps {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  product,
  onConfirm,
  onCancel
}) => {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.warningIcon}>
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <h2 className={styles.modalTitle}>Xác nhận xóa sản phẩm</h2>
          <button className={styles.closeButton} onClick={onCancel}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.productInfo}>
            {product.images.length > 0 && (
              <div className={styles.productImage}>
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                />
              </div>
            )}
            <div className={styles.productDetails}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productCategory}>{product.category}</p>
              <p className={styles.productPrice}>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(product.price)}
              </p>
            </div>
          </div>

          <div className={styles.warningMessage}>
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm này không? 
              Hành động này không thể hoàn tác.
            </p>
            <div className={styles.warningDetails}>
              <p><strong>Lưu ý:</strong></p>
              <ul>
                <li>Sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống</li>
                <li>Tất cả dữ liệu liên quan sẽ bị mất</li>
                <li>Không thể khôi phục sau khi xóa</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Hủy
          </button>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={onConfirm}
          >
            <FontAwesomeIcon icon={faTrash} />
            Xóa sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

