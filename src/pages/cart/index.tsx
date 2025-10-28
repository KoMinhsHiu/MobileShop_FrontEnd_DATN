import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useCart } from "@/context/cartContext";
import { formatPrice, parsePrice } from "@/utils/function/formatPrice";
import MetaTags from "@/component/metaTags";
import CartItem from "@/component/cart/cartItem";
import { withAuth } from "@/component/auth";

import styles from "./cart.module.scss";

const CartPageComponent = () => {
  const { cart, isLoading } = useCart();
  const router = useRouter();

  // Calculate cart summary
  const cartSummary = useMemo(() => {
    if (!cart?.products) {
      return {
        totalItems: 0,
        subtotal: 0,
        shippingFee: 0,
        grandTotal: 0
      };
    }

    console.log('🛒 Cart products:', cart.products);
    
    const totalItems = cart.products.reduce((sum: number, product: any) => sum + product.quantity, 0);
    const subtotal = cart.products.reduce((sum: number, product: any) => {
      const price = parsePrice(product.price);
      console.log(`🛒 Product: ${product.name}, Price: ${product.price}, Parsed: ${price}, Quantity: ${product.quantity}`);
      return sum + (price * product.quantity);
    }, 0);
    
    console.log('🛒 Calculated subtotal:', subtotal);
    
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


  const handleCheckout = () => {
    // Navigate to checkout page
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  return (
    <>
      <MetaTags
        title="Giỏ hàng - PhoneHub"
        description="Xem và quản lý sản phẩm trong giỏ hàng của bạn"
      />
      
      <div className={styles.cartPage}>
        <div className="container">
          {/* Page Header */}
          <div className={styles.pageHeader}>
            <div className={styles.breadcrumb}>
              <Link href="/">Trang chủ</Link>
              <span>/</span>
              <span>Giỏ hàng</span>
            </div>
            <h1 className={styles.pageTitle}>Giỏ hàng của bạn</h1>
            <p className={styles.pageSubtitle}>
              {isLoading ? 'Đang tải...' : cartSummary.totalItems > 0 
                ? `Bạn có ${cartSummary.totalItems} sản phẩm trong giỏ hàng` 
                : 'Giỏ hàng của bạn đang trống'
              }
            </p>
          </div>

          {isLoading ? (
            // Loading State
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
                <p>Đang tải giỏ hàng...</p>
              </div>
            </div>
          ) : cart && cart.products && cart.products.length > 0 ? (
        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            <div className={styles.sectionHeader}>
              <h2>Danh sách sản phẩm ({cart.products.length} sản phẩm)</h2>
            </div>
            
            <div className={styles.itemsList}>
              <div className={styles.tableHeader}>
                <div className={styles.headerColumn}>Sản phẩm</div>
                <div className={styles.headerColumn}></div>
                <div className={styles.headerColumn}>Giá đơn vị</div>
                <div className={styles.headerColumn}>Số lượng</div>
                <div className={styles.headerColumn}>Thành tiền</div>
                <div className={styles.headerColumn}></div>
              </div>
              
              <div className={styles.itemsContainer}>
                {cart.products.map((product: any, idx: number) => (
                  <CartItem product={product} key={idx} />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.cartSummary}>
                <div className={styles.sectionHeader}>
                  <h2>Tóm tắt đơn hàng</h2>
                </div>
                
                <div className={styles.summaryCard}>
                  <div className={styles.summaryDetails}>
                    <div className={styles.summaryRow}>
                      <span>Tổng số lượng:</span>
                      <span>{cartSummary.totalItems} sản phẩm</span>
                    </div>
                    
                    <div className={styles.summaryRow}>
                      <span>Tổng tiền hàng:</span>
                      <span>{formatPrice(cartSummary.subtotal)}</span>
                    </div>
                    
                    <div className={styles.summaryRow}>
                      <span>Phí vận chuyển:</span>
                      <span className={cartSummary.shippingFee === 0 ? styles.freeShipping : ''}>
                        {cartSummary.shippingFee === 0 ? 'Miễn phí' : formatPrice(cartSummary.shippingFee)}
                      </span>
                    </div>
                    
                    {cartSummary.subtotal < 500000 && cartSummary.subtotal > 0 && (
                      <div className={styles.shippingNote}>
                        <small>Mua thêm {formatPrice(500000 - cartSummary.subtotal)} để được miễn phí vận chuyển</small>
                      </div>
                    )}
                    
                    <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(cartSummary.grandTotal)}</span>
                    </div>
                  </div>

                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.checkoutBtn}
                      onClick={handleCheckout}
                    >
                      Tiến hành thanh toán
                    </button>
                    <button 
                      className={styles.continueBtn}
                      onClick={handleContinueShopping}
                    >
                      Tiếp tục mua sắm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Empty Cart State
            <div className={styles.emptyCart}>
              <div className={styles.emptyCartContent}>
                <div className={styles.emptyIcon}>🛒</div>
                <h2>Giỏ hàng của bạn đang trống</h2>
                <p>Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và thêm vào giỏ hàng!</p>
                <button 
                  className={styles.shopNowBtn}
                  onClick={handleContinueShopping}
                >
                  Mua sắm ngay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Protect the cart page with authentication
const CartPage = withAuth(CartPageComponent);

export default CartPage;

