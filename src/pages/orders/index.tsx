import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import MetaTags from "@/component/metaTags";
import { Order } from "@/utils/type/order";
import { useFetchOrders } from "@/utils/hooks/api/useFetchOrders";
import OrderTable from "@/component/order/orderTable";
import { withAuth } from "@/component/auth";

import styles from "./orders.module.scss";

const OrdersPageComponent = () => {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { orders, loading, error, refetch } = useFetchOrders();
  const router = useRouter();

  // Note: Auth protection is now handled by withAuth HOC
  // No need to check isLoading from useAuth anymore

  useEffect(() => {
    console.log('🔍 Orders useEffect triggered:', { orders, statusFilter });
    
    if (!orders) {
      console.log('🔍 No orders, setting empty array');
      setFilteredOrders([]);
      return;
    }
    
    console.log('🔍 Orders found:', orders.length, orders);
    
    if (statusFilter === "all") {
      console.log('🔍 Setting all orders as filtered');
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => order.status === statusFilter);
      console.log('🔍 Filtered orders:', filtered.length, filtered);
      setFilteredOrders(filtered);
    }
  }, [statusFilter, orders]);




  // Show loading state while fetching orders
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

  // Show error state
  if (error) {
    const isAPIUpdateError = error.includes('API đơn hàng đang được cập nhật');
    
    return (
      <>
        <MetaTags
          title="Đơn hàng của tôi - PhoneHub"
          description="Xem và quản lý đơn hàng của bạn"
        />
        <div className={styles.ordersPage}>
          <div className="container">
            <div className={styles.errorState}>
              <div className={styles.errorIcon}>
                {isAPIUpdateError ? '🔄' : '⚠️'}
              </div>
              <h2>
                {isAPIUpdateError ? 'Hệ thống đang cập nhật' : 'Có lỗi xảy ra'}
              </h2>
              <p>{error}</p>
              {isAPIUpdateError && (
                <div style={{ 
                  backgroundColor: '#fff3cd', 
                  border: '1px solid #ffeaa7', 
                  borderRadius: '4px', 
                  padding: '15px', 
                  margin: '15px 0',
                  fontSize: '14px'
                }}>
                  <strong>💡 Thông tin:</strong> Chúng tôi đang cập nhật hệ thống để cải thiện trải nghiệm người dùng. 
                  Vui lòng quay lại sau vài phút.
                </div>
              )}
              <button 
                className={styles.retryBtn}
                onClick={() => refetch()}
              >
                {isAPIUpdateError ? 'Kiểm tra lại' : 'Thử lại'}
              </button>
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

          {!orders || orders.length === 0 ? (
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
                    <option value="paid">Đã thanh toán</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đang giao hàng</option>
                    <option value="delivered">Đã giao hàng</option>
                    <option value="canceled">Đã hủy</option>
                    <option value="failed">Thất bại</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <strong>Debug Info:</strong> Total orders: {orders?.length || 0}, Filtered orders: {filteredOrders?.length || 0}
              </div>

              <OrderTable orders={filteredOrders} />

              {filteredOrders.length === 0 && statusFilter !== "all" && (
                <div className={styles.noResults}>
                  <p>Không có đơn hàng nào với trạng thái đã chọn.</p>
                </div>
              )}

              {filteredOrders.length === 0 && statusFilter === "all" && orders?.length === 0 && (
                <div className={styles.noResults}>
                  <p>Bạn chưa có đơn hàng nào.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Protect the orders page with authentication
const OrdersPage = withAuth(OrdersPageComponent);

export default OrdersPage;
