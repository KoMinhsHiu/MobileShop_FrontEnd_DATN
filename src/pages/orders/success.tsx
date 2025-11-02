import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import MetaTags from "@/component/metaTags";
import styles from "./success.module.scss";

const OrderSuccessPage = () => {
  const router = useRouter();
  const { orderId, orderCode, transactionId, amount, payDate } = router.query;
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {

    // Auto redirect to home after 10 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);

    // Countdown timer
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [router]);

  // ...existing code...

  const formatVNPayDate = (dateString: string): string => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    const hour = dateString.slice(8, 10);
    const minute = dateString.slice(10, 12);
    const second = dateString.slice(12, 14);

    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);

    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  const rawPayDate = Array.isArray(payDate) ? payDate[0] : payDate;
  const orderTime = rawPayDate
    ? (() => {
        if (rawPayDate.length === 14 && !isNaN(Number(rawPayDate))) {
          return formatVNPayDate(rawPayDate);
        }
        
        const d = new Date(rawPayDate);
        if (!isNaN(d.getTime())) {
          return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).format(d);
        }
        return String(rawPayDate);
      })()
    : undefined;

  return (
    <>
      <MetaTags
        title="Đặt hàng thành công - PhoneHub"
        description="Cảm ơn bạn đã đặt hàng"
      />
      
      <div className={styles.successPage}>
        <div className="container">
          <div className={styles.successContent}>
            <div className={styles.successIcon}>✅</div>
            <h1 className={styles.successTitle}>Đặt hàng thành công!</h1>
            <p className={styles.successMessage}>
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
            </p>
            
            <div className={styles.orderInfo}>
              <p>ID đơn hàng: <strong>{orderId || 'Đang tạo...'}</strong></p>
              <p>Mã đơn hàng: <strong>{(() => {
                const code = Array.isArray(orderCode) ? orderCode[0] : orderCode;
                return code ? String(code).slice(0, 12) : 'Đang tạo...';
              })()}</strong></p>
              <p>Mã giao dịch: <strong>{transactionId || 'Đang tạo...'}</strong></p>
              <p>Số tiền thanh toán: <strong>{amount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount)) : 'Đang tạo...'}</strong></p>
              <p>Thời gian đặt hàng: <strong>{orderTime || 'Đang tải...'}</strong></p>
            </div>

            <div className={styles.actionButtons}>
              <Link href="/" className={styles.continueShoppingBtn}>
                Tiếp tục mua sắm
              </Link>
              <Link href="/orders" className={styles.viewOrdersBtn}>
                Xem đơn hàng
              </Link>
            </div>

            <div className={styles.autoRedirect}>
              <p>Tự động chuyển về trang chủ sau <span className={styles.countdown}>{countdown}</span> giây</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessPage;
