import React from 'react';
import { Voucher } from '@/utils/api/voucher';
import styles from './voucherSelector.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface VoucherSelectorProps {
  vouchers: Voucher[];
  selectedVoucher: Voucher | null;
  onSelect: (voucher: Voucher | null) => void;
  isLoading: boolean;
  subtotal: number;
  selectedPayment: string;
}

const VoucherSelector: React.FC<VoucherSelectorProps> = ({ 
  vouchers, 
  selectedVoucher, 
  onSelect, 
  isLoading,
  subtotal,
  selectedPayment
}) => {
  const checkPaymentValidity = (voucher: Voucher): { isValid: boolean; allowedNames: string[] } => {
    if (voucher.appliesTo !== 'payment_method') {
      return { isValid: true, allowedNames: [] };
    }

    if (!voucher.paymentMethods || voucher.paymentMethods.length === 0) {
      return { isValid: true, allowedNames: [] };
    }

    const isValid = voucher.paymentMethods.some(pm => 
      pm.paymentMethod.code.toLowerCase() === selectedPayment.toLowerCase()
    );

    const allowedNames = voucher.paymentMethods.map(pm => pm.paymentMethod.name);

    return { isValid, allowedNames };
  };

  const handleSelectVoucher = (voucher: Voucher, isMinOrderValid: boolean, isPaymentValid: boolean) => {
    if (selectedVoucher?.id === voucher.id) {
      onSelect(null);
      return;
    }

    if (!isMinOrderValid) {
        alert(`Đơn hàng chưa đạt giá trị tối thiểu ${voucher.minOrderValue.toLocaleString()}đ`);
        return;
    }

    if (!isPaymentValid) {
        const { allowedNames } = checkPaymentValidity(voucher);
        alert(`Voucher này chỉ áp dụng cho phương thức thanh toán: ${allowedNames.join(', ')}`);
        return;
    }

    onSelect(voucher);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        <FontAwesomeIcon icon={faTicket} /> Voucher ưu đãi
      </h3>

      <div className={styles.list}>
        {isLoading ? (
          <p className={styles.loading}>Đang tải ưu đãi...</p>
        ) : vouchers.length === 0 ? (
          <p className={styles.empty}>Không có mã giảm giá nào phù hợp.</p>
        ) : (
          vouchers.map((voucher) => {
            const isMinOrderValid = subtotal >= voucher.minOrderValue;
            const { isValid: isPaymentValid, allowedNames } = checkPaymentValidity(voucher);
            const isDisabled = !isMinOrderValid || !isPaymentValid;
            
            return (
              <div 
                key={voucher.id}
                className={`${styles.item} ${selectedVoucher?.id === voucher.id ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
                onClick={() => !isDisabled && handleSelectVoucher(voucher, isMinOrderValid, isPaymentValid)}
              >
                <div className={styles.info}>
                  <div className={styles.code}>{voucher.code}</div>
                  <div className={styles.desc}>
                    {voucher.title}
                    <span className={styles.subDesc}>
                      {voucher.discountType === 'percent' 
                        ? `Giảm ${voucher.discountValue}%` 
                        : `Giảm ${voucher.discountValue.toLocaleString()}đ`} 
                      {voucher.maxDiscountValue > 0 && ` (Tối đa ${voucher.maxDiscountValue.toLocaleString()}đ)`}
                    </span>
                    <span className={styles.minOrder}>
                      Đơn tối thiểu: {voucher.minOrderValue.toLocaleString()}đ
                    </span>
                  </div>
                </div>
                
                <div className={styles.action}>
                   {selectedVoucher?.id === voucher.id ? (
                     <FontAwesomeIcon icon={faCheckCircle} className={styles.checkedIcon} />
                   ) : (
                     <div className={styles.radioCircle}></div>
                   )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VoucherSelector;