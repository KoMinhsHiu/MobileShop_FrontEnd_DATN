import React from "react";
import { useRouter } from "next/router";
import { Order } from "@/utils/type/order";
import { formatPrice } from "@/utils/function/formatPrice";
import OrderStatusBadge from "../orderStatusBadge";

import styles from "./orderTable.module.scss";

interface OrderTableProps {
  orders: Order[];
}

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  const router = useRouter();

  // Debug: Log orders data
  React.useEffect(() => {
    console.log('📅 OrderTable - Orders received:', orders.length);
    orders.forEach((order, index) => {
      console.log(`📅 Order ${index + 1}:`, {
        id: order.id,
        orderCode: order.orderCode,
        orderDate: order.orderDate,
        orderDateRaw: JSON.stringify(order.orderDate)
      });
    });
  }, [orders]);

  const handleViewOrderDetail = (orderId: number) => {
    router.push(`/orders/${orderId}`);
  };

  const formatDate = (dateString: string) => {
    console.log('📅 Formatting:', dateString);
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    console.log('📅 Result:', formatted);
    return formatted;
  };

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
    <div className={styles.ordersTable}>
      <div className={styles.tableHeader}>
        <div className={styles.headerCell}>Mã đơn hàng</div>
        <div className={styles.headerCell}>Ngày đặt</div>
        <div className={styles.headerCell}>Tổng tiền</div>
        <div className={styles.headerCell}>Trạng thái</div>
        <div className={styles.headerCell}>Thao tác</div>
      </div>
      
      <div className={styles.tableBody}>
        {orders.map((order) => (
          <div key={order.id} className={styles.tableRow}>
            <div className={styles.tableCell}>
              <span className={styles.orderNumber}>{order.orderCode}</span>
            </div>
            <div className={styles.tableCell}>
              <span className={styles.orderDate}>{formatDate(order.orderDate)}</span>
            </div>
            <div className={styles.tableCell}>
              <span className={styles.orderTotal}>
                {formatPrice(order.finalAmount)}
              </span>
            </div>
            <div className={styles.tableCell}>
              <OrderStatusBadge 
                status={order.status} 
                statusConfig={{
                  [order.status]: {
                    label: getStatusLabel(order.status),
                    color: getStatusColor(order.status),
                    icon: '📦'
                  }
                }} 
              />
            </div>
            <div className={styles.tableCell}>
              <button 
                className={styles.viewDetailBtn}
                onClick={() => handleViewOrderDetail(order.id)}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTable;
