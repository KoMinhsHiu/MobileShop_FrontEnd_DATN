import React, { useState, useEffect } from "react";
import Link from "next/link";

import MetaTags from "@/component/metaTags";
import { Order } from "@/utils/type/order";
import { mockOrders } from "./mockData";
import OrderTable from "@/component/order/orderTable";

import styles from "./orders.module.scss";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading orders
    const loadOrders = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    };

    loadOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [statusFilter, orders]);




  if (loading) {
    return (
      <>
        <MetaTags
          title="Đơn hàng của tôi - PhoneHub"
          description="Xem và quản lý đơn hàng của bạn"
        />
        <div className={styles.ordersPage}>
          <div className="container">
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Đang tải đơn hàng...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags
        title="Đơn hàng của tôi - PhoneHub"
        description="Xem và quản lý đơn hàng của bạn"
      />
      
      <div className={styles.ordersPage}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Đơn hàng của tôi</h1>
            <p className={styles.pageSubtitle}>
              Quản lý và theo dõi đơn hàng của bạn
            </p>
          </div>

          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📦</div>
              <h2>Chưa có đơn hàng nào</h2>
              <p>Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
              <Link href="/" className={styles.shopNowBtn}>
                Mua sắm ngay
              </Link>
            </div>
          ) : (
            <>
              <div className={styles.filters}>
                <div className={styles.filterGroup}>
                  <label>Lọc theo trạng thái:</label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">Tất cả</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="shipping">Đang giao hàng</option>
                    <option value="delivered">Đã giao hàng</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>

              <OrderTable orders={filteredOrders} />

              {filteredOrders.length === 0 && statusFilter !== "all" && (
                <div className={styles.noResults}>
                  <p>Không có đơn hàng nào với trạng thái đã chọn.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
