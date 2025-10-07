import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";

import { useCart } from "@/context/cartContext";
import MetaTags from "@/component/metaTags";
import ShippingForm from "@/component/checkout/ShippingForm";
import PaymentMethods from "@/component/checkout/PaymentMethods";
import OrderSummary from "@/component/checkout/OrderSummary";
import { ShippingInfo } from "@/component/checkout/ShippingForm/types";
import { PaymentMethod } from "@/component/checkout/PaymentMethods/types";

import styles from "./checkout.module.scss";

const CheckoutPage = () => {
  const { cart } = useCart();
  const router = useRouter();

  // Form state
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    note: ''
  });

  const [selectedPayment, setSelectedPayment] = useState<string>('cod');
  const [phoneError, setPhoneError] = useState<string>('');

  const paymentMethods: PaymentMethod[] = [
    { type: 'cod', label: 'Thanh toán khi nhận hàng (COD)' },
    { type: 'paypal', label: 'PayPal' },
    { type: 'momo', label: 'Momo' },
    { type: 'vnpay', label: 'VNPay' }
  ];

  // Calculate order summary
  const orderSummary = useMemo(() => {
    if (!cart?.products) {
      return {
        totalItems: 0,
        subtotal: 0,
        shippingFee: 0,
        grandTotal: 0
      };
    }

    const totalItems = cart.products.reduce((sum: number, product: any) => sum + product.quantity, 0);
    const subtotal = cart.products.reduce((sum: number, product: any) => {
      const price = parsePrice(product.price);
      return sum + (price * product.quantity);
    }, 0);
    
    // Calculate shipping fee (free shipping for orders over 500,000 VND)
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const grandTotal = subtotal + shippingFee;

    return {
      totalItems,
      subtotal,
      shippingFee,
      grandTotal
    };
  }, [cart?.products]);

  const validatePhone = (phone: string): boolean => {
    // Kiểm tra số điện thoại: bắt đầu bằng 0, có 10 ký tự, chỉ chứa số
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));

    // Validate phone number in real-time
    if (field === 'phone') {
      if (value && !validatePhone(value)) {
        setPhoneError('Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số');
      } else {
        setPhoneError('');
      }
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.province || 
        !shippingInfo.district || !shippingInfo.ward || !shippingInfo.address) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    // Validate phone number
    if (!validatePhone(shippingInfo.phone)) {
      setPhoneError('Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số');
      return;
    }

    if (!cart?.products || cart.products.length === 0) {
      alert('Giỏ hàng trống');
      return;
    }

    // Create order object
    const order = {
      shippingInfo,
      paymentMethod: selectedPayment,
      products: cart.products,
      summary: orderSummary,
      orderDate: new Date().toISOString()
    };

    // Handle different payment methods
    switch (selectedPayment) {
      case 'cod':
        alert('Đơn hàng đã được tạo thành công! Bạn sẽ thanh toán khi nhận hàng.');
        // Clear cart and redirect
        router.push('/orders/success');
        break;
      case 'paypal':
        alert('Chuyển hướng đến PayPal...');
        // Implement PayPal integration
        break;
      case 'momo':
        alert('Chuyển hướng đến Momo...');
        // Implement Momo integration
        break;
      case 'vnpay':
        alert('Chuyển hướng đến VNPay...');
        // Implement VNPay integration
        break;
      default:
        alert('Phương thức thanh toán không hợp lệ');
    }
  };

  if (!cart?.products || cart.products.length === 0) {
    return (
      <div className={styles.checkoutPage}>
        <div className="container">
          <div className={styles.emptyCart}>
            <div className={styles.emptyCartContent}>
              <div className={styles.emptyIcon}>🛒</div>
              <h2>Giỏ hàng của bạn đang trống</h2>
              <p>Hãy thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
              <button 
                className={styles.shopNowBtn}
                onClick={() => router.push('/')}
              >
                Mua sắm ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title="Thanh toán - PhoneHub"
        description="Hoàn tất đơn hàng của bạn"
      />
      
      <div className={styles.checkoutPage}>
        <div className="container">
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.breadcrumb}>
              <button onClick={() => router.push('/')}>Trang chủ</button>
              <span>/</span>
              <button onClick={() => router.push('/cart')}>Giỏ hàng</button>
              <span>/</span>
              <span>Thanh toán</span>
            </div>
            <h1 className={styles.pageTitle}>Thanh toán</h1>
          </div>

           <form onSubmit={handleSubmitOrder} className={styles.checkoutForm}>
             <div className={styles.checkoutContent}>
               {/* Left Column - Form */}
               <div className={styles.formSection}>
                 <ShippingForm
                   shippingInfo={shippingInfo}
                   phoneError={phoneError}
                   onInputChange={handleInputChange}
                 />
                 
                 <PaymentMethods
                   paymentMethods={paymentMethods}
                   selectedPayment={selectedPayment}
                   onPaymentChange={setSelectedPayment}
                 />
               </div>

               {/* Right Column - Order Summary */}
               <div className={styles.summarySection}>
                 <OrderSummary
                   products={cart.products}
                   orderSummary={orderSummary}
                   onSubmitOrder={handleSubmitOrder}
                 />
               </div>
             </div>
           </form>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
