import React from "react";
import { formatPrice } from "@/utils/function/formatPrice";
import styles from "./orderSummary.module.scss";
import Image from 'next/image';

export interface OrderSummaryProps {
  products: any[];
  orderSummary: {
    subtotal: number;
    shippingFee: number;
    grandTotal: number;
  };
  voucherDiscountAmount?: number;
  pointDiscountAmount?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  products,
  orderSummary,
  voucherDiscountAmount = 0,
  pointDiscountAmount = 0
}) => {
  return (
    <div className={styles.orderSummary}>
      <div className={styles.orderItems}>
        {products.map((product: any, idx: number) => (
          <div key={idx} className={styles.orderItem}>
            <div className={styles.itemImage}>
               <Image src={product.image} width={60} height={60} alt={product.name} />
            </div>
            <div className={styles.itemInfo}>
               <h4>{product.name}</h4>
               <p>SL: {product.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summaryDetails}>
        <div className={styles.summaryRow}>
          <span>Tổng tiền hàng:</span>
          <span>{formatPrice(orderSummary.subtotal)}</span>
        </div>
        
        <div className={styles.summaryRow}>
          <span>Phí vận chuyển:</span>
          <span>
            {orderSummary.shippingFee === 0 ? 'Đang tính...' : formatPrice(orderSummary.shippingFee)}
          </span>
        </div>

        {voucherDiscountAmount > 0 && (
          <div className={`${styles.summaryRow} ${styles.discountRow}`}>
            <span>Voucher giảm giá:</span>
            <span style={{ color: '#d70018' }}>-{formatPrice(voucherDiscountAmount)}</span>
          </div>
        )}

        {pointDiscountAmount > 0 && (
          <div className={`${styles.summaryRow} ${styles.discountRow}`}>
            <span>Điểm tích lũy:</span>
            <span style={{ color: '#28a745' }}>-{formatPrice(pointDiscountAmount)}</span>
          </div>
        )}
        
        <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
          <span>Tổng cộng:</span>
          <span>{formatPrice(orderSummary.grandTotal)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;