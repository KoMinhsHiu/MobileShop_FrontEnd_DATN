import React from "react";
import { formatPrice, parsePrice } from "@/utils/function/formatPrice";
import { OrderSummaryProps } from "./types";
import styles from "./orderSummary.module.scss";

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
              <img 
                src={product.image || '/placeholder-product.jpg'} 
                alt={product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                }}
              />
            </div>
            <div className={styles.itemInfo}>
              <h4>{product.name}</h4>
              <p>Số lượng: {product.quantity}</p>
              <p className={styles.itemPrice}>{formatPrice(parsePrice(product.price) * product.quantity)}</p>
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
          <span className={orderSummary.shippingFee === 0 ? styles.freeShipping : ''}>
            {orderSummary.shippingFee === 0 ? 'Miễn phí' : formatPrice(orderSummary.shippingFee)}
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
