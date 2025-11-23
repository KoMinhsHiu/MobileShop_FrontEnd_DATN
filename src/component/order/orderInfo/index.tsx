import React from "react";
import { Order } from "@/utils/api/orders";
import { formatDate, getPaymentMethodLabel } from "@/utils/function/ordersUtils";
import OrderStatusBadge from "../orderStatusBadge";
import styles from "./orderInfo.module.scss";

interface OrderInfoProps {
  order: Order;
}

const OrderInfo: React.FC<OrderInfoProps> = ({ order }) => {
  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'Chờ xác nhận',
      paid: 'Đã thanh toán',
      processing: 'Đang xử lý',
      shipped: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      canceled: 'Đã hủy',
      failed: 'Thất bại'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      pending: '#f59e0b',
      paid: '#3b82f6',
      processing: '#8b5cf6',
      shipped: '#06b6d4',
      delivered: '#10b981',
      canceled: '#ef4444',
      failed: '#6b7280'
    };
    return colorMap[status] || '#6b7280';
  };

  return (
    <div className={styles.orderInfo}>
      <div className={styles.infoCard}>
        <h3>Thông tin đơn hàng</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Mã đơn hàng:</span>
            <span className={styles.infoValue}>{order.orderCode}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Ngày đặt:</span>
            <span className={styles.infoValue}>{formatDate(order.orderDate)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Phương thức thanh toán:</span>
            <span className={styles.infoValue}>{getPaymentMethodLabel(order.payments[0].paymentMethod.name)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Trạng thái:</span>
            <OrderStatusBadge 
              status={order.status}
              statusConfig={{
                pending: {
                  label: getStatusLabel('pending'),
                  color: getStatusColor('pending'),
                  icon: '⏳'
                },
                paid: {
                  label: getStatusLabel('paid'),
                  color: getStatusColor('paid'),
                  icon: '💰'
                },
                processing: {
                  label: getStatusLabel('processing'),
                  color: getStatusColor('processing'),
                  icon: '🔄'
                },
                shipped: {
                  label: getStatusLabel('shipped'),
                  color: getStatusColor('shipped'),
                  icon: '🚚'
                },
                delivered: {
                  label: getStatusLabel('delivered'),
                  color: getStatusColor('delivered'),
                  icon: '✅'
                },
                canceled: {
                  label: getStatusLabel('canceled'),
                  color: getStatusColor('canceled'),
                  icon: '❌'
                },
                failed: {
                  label: getStatusLabel('failed'),
                  color: getStatusColor('failed'),
                  icon: '⚠️'
                }
              }} 
            />
          </div>
        </div>
      </div>

      <div className={styles.infoCard}>
        <h3>Thông tin người nhận</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Họ tên:</span>
            <span className={styles.infoValue}>{order.recipientName}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Số điện thoại:</span>
            <span className={styles.infoValue}>{order.recipientPhone}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Địa chỉ:</span>
            <span className={styles.infoValue}>
              {order.street}
              {order.commune?.name ? `, ${order.commune.name}` : ''}
              {order.province?.name ? `, ${order.province.name}` : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
