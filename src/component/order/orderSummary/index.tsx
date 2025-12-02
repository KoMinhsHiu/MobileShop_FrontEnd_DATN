import React from "react";
import type { OrderSummary } from "@/utils/type/order";
import { formatPrice } from "@/utils/function/formatPrice";
import { getPaymentMethodLabel } from "@/utils/function/ordersUtils";

import styles from "./orderSummary.module.scss";

interface OrderSummaryProps {
  summary: OrderSummary;
  paymentMethod: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ summary, paymentMethod }) => {
  return (
    <div className={styles.orderSummary}>
      <h3>Tổng cộng</h3>
      <div className={styles.summaryCard}>
        <div className={styles.summaryRow}>
          <span>Tạm tính:</span>
          <span>{formatPrice(summary.subtotal)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Phí vận chuyển:</span>
          <span>
            {summary.shippingFee === 0 
              ? "Miễn phí" 
              : formatPrice(summary.shippingFee)
            }
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span>Giảm giá:</span>
          <span>
            {summary.discountAmount === 0 
              ? "Không" 
              : formatPrice(summary.discountAmount)
            }
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span>Phương thức thanh toán:</span>
          <span>{getPaymentMethodLabel(paymentMethod)}</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
          <span>Tổng cộng:</span>
          <span className={styles.totalPrice}>
            {formatPrice(summary.grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
