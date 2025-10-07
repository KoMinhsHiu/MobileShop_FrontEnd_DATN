import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import MetaTags from "@/component/metaTags";
import styles from "./success.module.scss";

const OrderSuccessPage = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>('');
  const [orderTime, setOrderTime] = useState<string>('');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Set order info on client side only
    setOrderId(`#${Date.now().toString().slice(-8)}`);
    setOrderTime(new Date().toLocaleString('vi-VN'));

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
              <p>Mã đơn hàng: <strong>{orderId || 'Đang tạo...'}</strong></p>
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
