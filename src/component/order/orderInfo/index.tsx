import React from "react";
import { Order } from "@/utils/type/order";
import { orderStatusConfig } from "@/pages/orders/mockData";
import { formatDate, getPaymentMethodLabel } from "@/pages/orders/utils";
import OrderStatusBadge from "../orderStatusBadge";

import styles from "./orderInfo.module.scss";

interface OrderInfoProps {
  order: Order;
}

const OrderInfo: React.FC<OrderInfoProps> = ({ order }) => {
  return (
    <div className={styles.orderInfo}>
      <div className={styles.infoCard}>
        <h3>Thông tin đơn hàng</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Mã đơn hàng:</span>
            <span className={styles.infoValue}>{order.orderNumber}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Ngày đặt:</span>
            <span className={styles.infoValue}>{formatDate(order.orderDate)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Phương thức thanh toán:</span>
            <span className={styles.infoValue}>{getPaymentMethodLabel(order.paymentMethod)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Trạng thái:</span>
            <OrderStatusBadge 
              status={order.status} 
              statusConfig={orderStatusConfig} 
            />
          </div>
        </div>
      </div>

      <div className={styles.infoCard}>
        <h3>Thông tin người nhận</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Họ tên:</span>
            <span className={styles.infoValue}>{order.shippingInfo.fullName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Số điện thoại:</span>
            <span className={styles.infoValue}>{order.shippingInfo.phone}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Địa chỉ:</span>
            <span className={styles.infoValue}>
              {order.shippingInfo.address}, {order.shippingInfo.ward}, {order.shippingInfo.district}, {order.shippingInfo.province}
            </span>
          </div>
          {order.shippingInfo.note && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Ghi chú:</span>
              <span className={styles.infoValue}>{order.shippingInfo.note}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
