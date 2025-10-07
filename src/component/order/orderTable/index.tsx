import React from "react";
import { useRouter } from "next/router";
import { Order } from "@/utils/type/order";
import { formatPrice } from "@/utils/function/formatPrice";
import { orderStatusConfig } from "@/pages/orders/mockData";
import { formatDate } from "@/pages/orders/utils";
import OrderStatusBadge from "../orderStatusBadge";

import styles from "./orderTable.module.scss";

interface OrderTableProps {
  orders: Order[];
}

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  const router = useRouter();

  const handleViewOrderDetail = (orderId: string) => {
    router.push(`/orders/${orderId}`);
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
              <span className={styles.orderNumber}>{order.orderNumber}</span>
            </div>
            <div className={styles.tableCell}>
              <span className={styles.orderDate}>{formatDate(order.orderDate)}</span>
            </div>
            <div className={styles.tableCell}>
              <span className={styles.orderTotal}>
                {formatPrice(order.summary.grandTotal)}
              </span>
            </div>
            <div className={styles.tableCell}>
              <OrderStatusBadge 
                status={order.status} 
                statusConfig={orderStatusConfig} 
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
