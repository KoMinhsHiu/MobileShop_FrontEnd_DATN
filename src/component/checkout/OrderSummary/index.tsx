import React from "react";
import { formatPrice, parsePrice } from "@/utils/function/formatPrice";
import { OrderSummaryProps } from "./types";
import styles from "./orderSummary.module.scss";

import Image from 'next/image';

const OrderSummary: React.FC<OrderSummaryProps> = ({
  products,
  orderSummary
}) => {
  return (
    <div className={styles.orderSummary}>
      <div className={styles.orderItems}>
        {products.map((product: any, idx: number) => (
          <div key={idx} className={styles.orderItem}>
            <div className={styles.itemImage}>
              <Image
                src={product.image || '/placeholder-product.jpg'}
                alt={product.name}
                width={60}
                height={60}
                priority
                className={styles.productImage}
                style={{ objectFit: 'cover', borderRadius: '8px' }}
                onError={(e) => {
                  if (e?.target) {
                    (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                  }
                }}
              />
            </div>
            <div className={styles.itemInfo}>
              <h4>{product.name}</h4>
              <p>Số lượng: {product.quantity}</p>
              <p className={styles.itemPrice}>
                {formatPrice(Math.max(0, (parsePrice(product.price) - parsePrice(product.discount || 0)) * product.quantity))}
              </p>
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
            {orderSummary.shippingFee === 0 ? (
              'Đang tính...'
            ) : (
              formatPrice(orderSummary.shippingFee)
            )}
          </span>
        </div>
        
        <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
          <span>Tổng cộng:</span>
          <span>{formatPrice(orderSummary.grandTotal)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
