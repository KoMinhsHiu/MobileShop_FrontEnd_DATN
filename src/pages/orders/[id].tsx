import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';
import { ordersAPI, Order } from '@/utils/api/orders';
import { formatPrice } from '@/utils/function/formatPrice';
import MetaTags from '@/component/metaTags';
import OrderStatusBadge from '@/component/order/orderStatusBadge';
import OrderTimeline from '@/component/order/orderTimeline';
import OrderItemsList from '@/component/order/orderItemsList';
import OrderSummary from '@/component/order/orderSummary';

import styles from './orderDetail.module.scss';

const OrderDetailPage = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const fetchOrderDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersAPI.getOrderById(Number(id));
      if (response.status === 200) {
        setOrder(response.data.order);
      } else {
        throw new Error(response.message || 'Failed to fetch order');
      }
    } catch (err: any) {
      console.error('Error fetching order:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/LoginSignup/login');
      return;
    }

    if (id && isAuthenticated) {
      fetchOrderDetail();
    }
  }, [id, isAuthenticated, isLoading, router, fetchOrderDetail]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (isLoading || loading) {
    return (
      <>
        <MetaTags
          title="Chi tiết đơn hàng - PhoneHub"
          description="Xem chi tiết đơn hàng của bạn"
        />
        <div className={styles.orderDetailPage}>
          <div className="container">
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Đang tải chi tiết đơn hàng...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MetaTags
          title="Chi tiết đơn hàng - PhoneHub"
          description="Xem chi tiết đơn hàng của bạn"
        />
        <div className={styles.orderDetailPage}>
          <div className="container">
            <div className={styles.errorState}>
              <div className={styles.errorIcon}>⚠️</div>
              <h2>Có lỗi xảy ra</h2>
              <p>{error}</p>
              <button 
                className={styles.retryBtn}
                onClick={fetchOrderDetail}
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <MetaTags
          title="Không tìm thấy đơn hàng - PhoneHub"
          description="Đơn hàng không tồn tại"
        />
        <div className={styles.orderDetailPage}>
          <div className="container">
            <div className={styles.notFound}>
              <div className={styles.notFoundIcon}>📦</div>
              <h2>Không tìm thấy đơn hàng</h2>
              <p>Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
              <Link href="/orders" className={styles.backBtn}>
                Quay lại danh sách đơn hàng
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags
        title={`Đơn hàng ${order.orderCode} - PhoneHub`}
        description="Xem chi tiết đơn hàng của bạn"
      />
      <div className={styles.orderDetailPage}>
        <div className="container">
          <div className={styles.pageHeader}>
            <Link href="/orders" className={styles.backLink}>
              ← Quay lại danh sách đơn hàng
            </Link>
            <h1 className={styles.pageTitle}>Chi tiết đơn hàng</h1>
            <p className={styles.orderCode}>Mã đơn hàng: {order.orderCode}</p>
          </div>

          <div className={styles.orderContent}>
            <div className={styles.orderInfo}>
              <div className={styles.infoCard}>
                <h3>Thông tin đơn hàng</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Mã đơn hàng:</span>
                    <span className={styles.value}>{order.orderCode}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Ngày đặt:</span>
                    <span className={styles.value}>{formatDate(order.orderDate)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Trạng thái:</span>
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
                <h3>Thông tin giao hàng</h3>
                <div className={styles.shippingInfo}>
                  <p><strong>Người nhận:</strong> {order.recipientName}</p>
                  <p><strong>Số điện thoại:</strong> {order.recipientPhone}</p>
                  <p><strong>Địa chỉ:</strong> {order.street}, {order.commune.name}, {order.province.name}</p>
                  {order.postalCode && <p><strong>Mã bưu điện:</strong> {order.postalCode}</p>}
                </div>
              </div>
            </div>

            <div className={styles.orderDetails}>
              <OrderItemsList items={order.items} />
              <OrderSummary 
                summary={{
                  totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
                  subtotal: order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
                  shippingFee: order.shippingFee,
                  grandTotal: order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + order.shippingFee
                }}
                paymentMethod={order.payments[0]?.paymentMethod.name || 'cod'}
              />
              <OrderTimeline 
                statusHistory={order.statusHistory || []}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailPage;