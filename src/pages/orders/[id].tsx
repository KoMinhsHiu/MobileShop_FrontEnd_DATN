import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';
import { ordersAPI, Order } from '@/utils/api/orders';
import MetaTags from '@/component/metaTags';
import OrderStatusBadge from '@/component/order/orderStatusBadge';
import OrderTimeline from '@/component/order/orderTimeline';
import OrderItemsList from '@/component/order/orderItemsList';
import OrderSummary from '@/component/order/orderSummary';
import { useToast } from '@/component/common/ToastContainer';
import styles from './orderDetail.module.scss';
import { withAuth } from '@/component/auth';
import RepayModal from '@/component/order/RepayModal';

const OrderDetailPage = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { showSuccess, showError, ToastContainer } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const fetchOrderDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersAPI.getCustomerOrderById(Number(id));
      if (response.status === 200) {
        setOrder(response.data);
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

  const handleCancelOrder = async () => {
    if (!order) return;

    const isConfirmed = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?');
    if (!isConfirmed) return;

    setIsActionLoading(true);
    try {
      await ordersAPI.cancelOrder(order.orderCode); 
      
      showSuccess('Đã hủy đơn hàng thành công');
      fetchOrderDetail();
    } catch (error: any) {
      console.error(error);
      showError(error.message || 'Không thể hủy đơn hàng');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleOpenPaymentModal = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    showSuccess('Đã cập nhật phương thức thanh toán thành công!');
    fetchOrderDetail();
  };

  const totalOrderAmount = order ? (order.items.reduce((sum, item) => sum + item.discount * item.quantity, 0) + order.shippingFee - order.discountAmount) : 0;

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
                </div>
              </div>

              {order.shipments && order.shipments.length > 0 && (
                <div className={styles.infoCard}>
                  <h3>Thông tin vận chuyển</h3>
                  {order.shipments.map((shipment) => (
                    <div key={shipment.id} className={styles.shipmentInfo}>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Đơn vị vận chuyển:</span>
                        <span className={styles.value} style={{fontWeight: 600}}>{shipment.provider}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Mã vận đơn:</span>
                        <span className={styles.value} style={{color: '#007bff'}}>{shipment.trackingCode}</span>
                      </div>
                      {shipment.estimatedDeliveryDate && (
                        <div className={styles.infoItem}>
                          <span className={styles.label}>Dự kiến giao:</span>
                          <span className={styles.value}>{formatDate(shipment.estimatedDeliveryDate)}</span>
                        </div>
                      )}
                      <div className={styles.infoItem}>
                        <span className={styles.label}>Phí vận chuyển:</span>
                        <span className={styles.value}>{shipment.fee.toLocaleString('vi-VN')} ₫</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.actionButtons}>
                {order.status === 'pending' && (
                  <button 
                    className={styles.cancelBtn}
                    onClick={handleCancelOrder}
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? 'Đang xử lý...' : 'Hủy đơn hàng'}
                  </button>
                )}

                {(!order.payments || order.payments.length === 0) && order.status === 'pending' && (
                  <button 
                    className={styles.repayBtn}
                    onClick={handleOpenPaymentModal}
                    disabled={loading}
                  >
                    Thanh toán ngay
                  </button>
                )}
              </div>
            </div>

            <div className={styles.orderDetails}>
              <OrderItemsList items={order.items} />
              <OrderSummary 
                summary={{
                  totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
                  subtotal: order.items.reduce((sum, item) => sum + item.discount * item.quantity, 0),
                  shippingFee: order.shippingFee,
                  discountAmount: order.discountAmount,
                  grandTotal: totalOrderAmount
                }}
                paymentMethod={order.payments[0]?.paymentMethod.name || 'undefined'}
              />
              <OrderTimeline 
                statusHistory={order.statusHistory || []}
              />
            </div>
          </div>
        </div>
      </div>
      {order && (
        <RepayModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          orderId={order.id}
          totalAmount={totalOrderAmount}
          onSuccess={handlePaymentSuccess}
        />
      )}
      <ToastContainer />
    </>
  );
};

const OrderDetail = withAuth(OrderDetailPage);

export default OrderDetail;