import React from "react";
import Link from "next/link";
import { Order } from "@/utils/type/order";
import OrderInfo from "@/component/order/orderInfo";
import OrderTimeline from "@/component/order/orderTimeline";
import OrderItemsList from "@/component/order/orderItemsList";
import OrderSummary from "@/component/order/orderSummary";
import styles from "./orderDetail.module.scss";

interface OrderDetailProps {
  order: Order | null;
  loading: boolean;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, loading }) => {
  if (loading) {
    return (
      <div className={styles.orderDetailPage}>
        <div className="container">
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Đang tải chi tiết đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.orderDetailPage}>
        <div className="container">
          <div className={styles.notFound}>
            <div className={styles.notFoundIcon}>❌</div>
            <h2>Không tìm thấy đơn hàng</h2>
            <p>Đơn hàng bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link href="/orders" className={styles.backToOrdersBtn}>
              Quay lại danh sách đơn hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.orderDetailPage}>
      <div className="container">
        <div className={styles.pageHeader}>
          <Link href="/orders" className={styles.backBtn}>
            ← Quay lại danh sách đơn hàng
          </Link>
          <h1 className={styles.pageTitle}>Chi tiết đơn hàng</h1>
        </div>

        <div className={styles.orderDetail}>
          <OrderInfo order={order} />
          <OrderTimeline status={order.status} />
          <OrderItemsList items={order.items} />
          <OrderSummary summary={order.summary} paymentMethod={order.paymentMethod} />
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

