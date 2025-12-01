import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMoneyBillWave, faCreditCard, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { paymentAPI } from '@/utils/api/payment';
import { useToast } from '@/component/common/ToastContainer';
import styles from './RepayModal.module.scss';

interface RepayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  totalAmount: number;
  onSuccess: () => void;
}

type PaymentMethodType = 'cod' | 'vnpay';

const RepayModal: React.FC<RepayModalProps> = ({ 
  isOpen, 
  onClose, 
  orderId, 
  totalAmount,
  onSuccess 
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('vnpay');
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useToast();

  if (!isOpen) return null;

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    try {
      if (selectedMethod === 'cod') {
        await paymentAPI.createCODPayment(orderId);
        onSuccess();
        onClose();
      } else if (selectedMethod === 'vnpay') {
        const response = await paymentAPI.getVNPayUrl(orderId);
        if (response && response.data && response.data.paymentUrl) {
           console.log('Redirecting to:', response.data.paymentUrl);
           window.location.href = response.data.paymentUrl;
        } else {
           throw new Error('Không lấy được đường dẫn thanh toán');
        }
      }
    } catch (error: any) {
      console.error(error);
      showError(error.message || 'Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Chọn phương thức thanh toán</h3>
          <button onClick={onClose} className={styles.closeBtn} disabled={isLoading}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.amountInfo}>
            Số tiền cần thanh toán: <span>{totalAmount.toLocaleString('vi-VN')} ₫</span>
          </p>

          <div className={styles.methodList}>
            {/* Tùy chọn VNPay */}
            <div 
              className={`${styles.methodItem} ${selectedMethod === 'vnpay' ? styles.selected : ''}`}
              onClick={() => setSelectedMethod('vnpay')}
            >
              <div className={styles.methodIcon}>
                <FontAwesomeIcon icon={faCreditCard} className={styles.iconVnpay} />
              </div>
              <div className={styles.methodInfo}>
                <span className={styles.methodName}>VNPay (Ví điện tử / Ngân hàng)</span>
                <span className={styles.methodDesc}>Thanh toán ngay lập tức, an toàn và bảo mật</span>
              </div>
              <div className={styles.radioCheck}>
                {selectedMethod === 'vnpay' && <FontAwesomeIcon icon={faCheckCircle} />}
              </div>
            </div>

            {/* Tùy chọn COD */}
            <div 
              className={`${styles.methodItem} ${selectedMethod === 'cod' ? styles.selected : ''}`}
              onClick={() => setSelectedMethod('cod')}
            >
              <div className={styles.methodIcon}>
                <FontAwesomeIcon icon={faMoneyBillWave} className={styles.iconCod} />
              </div>
              <div className={styles.methodInfo}>
                <span className={styles.methodName}>Thanh toán khi nhận hàng (COD)</span>
                <span className={styles.methodDesc}>Thanh toán tiền mặt khi shipper giao hàng đến</span>
              </div>
              <div className={styles.radioCheck}>
                {selectedMethod === 'cod' && <FontAwesomeIcon icon={faCheckCircle} />}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelBtn} disabled={isLoading}>
            Hủy bỏ
          </button>
          <button 
            onClick={handleConfirmPayment} 
            className={styles.confirmBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepayModal;