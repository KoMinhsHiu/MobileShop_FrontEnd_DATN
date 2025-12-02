import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useCart } from "@/context/cartContext";
import { parsePrice } from "@/utils/function/formatPrice";
import MetaTags from "@/component/metaTags";
import ShippingForm from "@/component/checkout/ShippingForm";
import PaymentMethods from "@/component/checkout/PaymentMethods";
import OrderSummary from "@/component/checkout/OrderSummary";
import { ShippingInfo } from "@/component/checkout/ShippingForm/types";
import { PaymentMethod } from "@/component/checkout/PaymentMethods/types";
import { ordersAPI, CreateOrderRequest, shippingAPI, PaymentMethodDto } from "@/utils/api/orders";
import { useLocation } from "@/utils/hooks/useLocation";
import { withAuth } from "@/component/auth";
import { voucherAPI, Voucher } from "@/utils/api/voucher";
import VoucherSelector from "@/component/checkout/VoucherSelector";
import styles from "./checkout.module.scss";
import { paymentAPI } from "@/utils/api/payment";
import customerAPI from "@/utils/api/customer";
import PointSelector from "@/component/checkout/PointSelector";

const CheckoutPageComponent = () => {
  const { cart } = useCart() as { cart: any };
  const router = useRouter();
  const { provinces, communes, selectedProvince, selectedCommune, loading, handleProvinceChange, handleCommuneChange } = useLocation();
  const [shippingFee, setShippingFee] = useState<string>('0 ₫');
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isLoadingVoucher, setIsLoadingVoucher] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [pointDiscount, setPointDiscount] = useState(0);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<string>('cod');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await customerAPI.getMe();
        if (userData && userData.data) {
          setUserPoints(userData.data.pointsBalance || 0);
        }
      } catch (error) {
        console.error("Error fetching user points:", error);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (selectedVoucher && selectedVoucher.appliesTo === 'payment_method') {
      const isValid = selectedVoucher.paymentMethods?.some(pm => 
        pm.paymentMethod.code.toLowerCase() === selectedPayment.toLowerCase()
      );
       
      if (!isValid) {
        setSelectedVoucher(null);
      }
    }
  }, [selectedPayment, selectedVoucher]);

  useEffect(() => {
    const fetchVouchers = async () => {
      if (!cart?.products || cart.products.length === 0) return;
      
      setIsLoadingVoucher(true);
      try {
        const variantIds = cart.products.map((p: any) => parseInt(p.productAttributeId));
        
        const response = await voucherAPI.getAvailableVouchers(variantIds);
        
        if (response && response.data) {
          setAvailableVouchers(response.data);
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      } finally {
        setIsLoadingVoucher(false);
      }
    };
    
    fetchVouchers();
  }, [cart?.products]);

  // Debug logging for communes state
  useEffect(() => {
    console.log('🔍 Checkout communes state changed:', {
      communesCount: communes.length,
      selectedProvince,
      selectedCommune,
      communes: communes.slice(0, 5) // Show first 5 communes for debugging
    });
  }, [communes, provinces, selectedProvince, selectedCommune]);

  useEffect(() => {
    const calculateShippingFee = async () => {
      if (!cart?.products || cart.products.length === 0) return;
      if (!selectedProvince || !selectedCommune) return;

      try {
        console.log('🚚 Calculating shipping fee...');

        const province = provinces.find(p => p.code.toString() === selectedProvince);
        const commune = communes.find(c => c.code.toString() === selectedCommune);

        const response = await shippingAPI.calculateShippingFee({
          province: province ? province.name : '',
          commune: commune ? commune.name : ''
        });

        if (response.status === 200 && response.data?.shippingFee) {
          setShippingFee(response.data.shippingFee);
          console.log('🚚 Shipping fee calculated:', response.data.shippingFee);
        } else {
          console.error('❌ Failed to calculate shipping fee:', response);
        }
      } catch (error) {
        console.error('❌ Error calculating shipping fee:', error);
      }
    };

    calculateShippingFee();
  }, [cart, selectedProvince, selectedCommune, communes, provinces]);
    

  // Form state
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    phone: '',
    province: '',
    commune: '',
    address: '',
    note: ''
  });

  const [phoneError, setPhoneError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const paymentMethods: PaymentMethod[] = [
    { type: 'cod', label: 'Thanh toán khi nhận hàng (COD)' },
    { type: 'vnpay', label: 'VNPay' }
  ];

  // Calculate order summary
  const orderSummary = useMemo(() => {
    if (!cart?.products) return { 
        totalItems: 0, subtotal: 0, shippingFee: 0, grandTotal: 0, 
        voucherDiscount: 0, pointDiscount: 0 
    };

    const subtotal = cart.products.reduce((sum: number, product: any) => {
      const basePrice = parsePrice(product.price);
      const discount = product.discount ? parsePrice(product.discount) : 0;
      return sum + ((basePrice - discount) * product.quantity);
    }, 0);

    const fee = parsePrice(shippingFee);
    
    let voucherDiscount = 0;
    if (selectedVoucher && subtotal >= selectedVoucher.minOrderValue) {
        if (selectedVoucher.discountType === 'amount') {
          voucherDiscount = selectedVoucher.discountValue;
        } else {
          voucherDiscount = (subtotal * selectedVoucher.discountValue) / 100;
          if (selectedVoucher.maxDiscountValue > 0) {
            voucherDiscount = Math.min(voucherDiscount, selectedVoucher.maxDiscountValue);
          }
        }
    }
    
    const totalDiscount = voucherDiscount + pointDiscount;
    const finalAmount = Math.max(0, subtotal + fee - totalDiscount);

    return {
      totalItems: cart.products.reduce((sum: number, p: any) => sum + p.quantity, 0),
      subtotal,
      shippingFee: fee,
      voucherDiscount,
      pointDiscount,
      grandTotal: finalAmount,
    };
  }, [cart?.products, shippingFee, selectedVoucher, pointDiscount]);

  const validatePhone = (phone: string): boolean => {
    // Kiểm tra số điện thoại: bắt đầu bằng 0, có 10 ký tự, chỉ chứa số
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handlePointsApply = (discount: number, points: number) => {
    setPointDiscount(discount);
    setPointsUsed(points);
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

  // Transform cart data to API format
  const transformCartToOrderItems = () => {
    if (!cart?.products) return [];

    return cart.products.map((product: any) => ({
      variantId: parseInt(product.productAttributeId),
      colorId: parseInt(product.colorId),
      quantity: product.quantity,
      price: parsePrice(product.price),
      discount: parsePrice(product.price) - parsePrice(product.discount || 0)
    }));
  };

  // Get province and commune IDs from names
  const getLocationIds = () => {
    console.log('🔍 getLocationIds called with:', {
      shippingInfo,
      provincesCount: provinces.length,
      communesCount: communes.length,
      selectedProvince,
      selectedCommune
    });

    // Method 1: Try to find by selected codes first (most reliable)
    let province = null;
    let commune = null;

    if (selectedProvince) {
      province = provinces.find(p => p.code.toString() === selectedProvince);
    }

    if (selectedCommune) {
      commune = communes.find(c => c.code.toString() === selectedCommune);
    }

    // Method 2: If not found by codes, try by names
    if (!province) {
      province = provinces.find(p => p.name === shippingInfo.province);
    }

    if (!commune) {
      commune = communes.find(c => c.name === shippingInfo.commune);
    }

    // Method 3: If still not found, try partial match
    if (!province) {
      province = provinces.find(p => p.name.includes(shippingInfo.province) || shippingInfo.province.includes(p.name));
    }
    
    if (!commune) {
      commune = communes.find(c => c.name.includes(shippingInfo.commune) || shippingInfo.commune.includes(c.name));
    }

    const result = {
      provinceId: province?.id || 1, // Use id instead of code
      communeId: commune?.id || 1, // Use id instead of code
      provinceCode: province?.code || 1, // Keep code for debugging
      communeCode: commune?.code || 1 // Keep code for debugging
    };

    console.log('🔍 Location IDs Debug:', {
      provinceName: shippingInfo.province,
      communeName: shippingInfo.commune,
      foundProvince: province,
      foundCommune: commune,
      result,
      searchMethod: {
        provinceByCode: selectedProvince ? provinces.find(p => p.code.toString() === selectedProvince) ? 'found' : 'not-found' : 'no-code',
        communeByCode: selectedCommune ? communes.find(c => c.code.toString() === selectedCommune) ? 'found' : 'not-found' : 'no-code',
        provinceByName: provinces.find(p => p.name === shippingInfo.province) ? 'found' : 'not-found',
        communeByName: communes.find(c => c.name === shippingInfo.commune) ? 'found' : 'not-found'
      },
      debugInfo: {
        allProvinces: provinces.map(p => ({ id: p.id, code: p.code, name: p.name })),
        allCommunes: communes.map(c => ({ id: c.id, code: c.code, name: c.name, provinceCode: c.provinceCode })),
        selectedProvinceCode: selectedProvince,
        selectedCommuneCode: selectedCommune
      }
    });

    // Log warning if using fallback values
    if (result.provinceId === 1 || result.communeId === 1) {
      console.warn('⚠️ Using fallback values for location IDs:', {
        provinceId: result.provinceId,
        communeId: result.communeId,
        provinceName: shippingInfo.province,
        communeName: shippingInfo.commune,
        debugInfo: {
          provincesAvailable: provinces.length > 0,
          communesAvailable: communes.length > 0,
          selectedProvince,
          selectedCommune,
          provinceFound: !!province,
          communeFound: !!commune
        }
      });
    }

    return result;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.province ||
        !shippingInfo.commune || !shippingInfo.address) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    // Validate that communes are loaded
    if (communes.length === 0) {
      toast.error('Đang tải danh sách phường/xã. Vui lòng thử lại sau.');
      console.warn('⚠️ Communes not loaded yet:', {
        communesCount: communes.length,
        selectedProvince,
        selectedCommune,
        shippingInfo
      });
      return;
    }

    // Validate phone number
    if (!validatePhone(shippingInfo.phone)) {
      setPhoneError('Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số');
      return;
    }

    if (!cart?.products || cart.products.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get location IDs
      const { provinceId, communeId, provinceCode, communeCode } = getLocationIds();
      
    // Validate location IDs (should not be fallback values)
    if (provinceId === 1 || communeId === 1) {
      toast.error('Không thể xác định địa chỉ. Vui lòng chọn lại tỉnh thành và phường xã.');
      console.error('❌ Invalid location IDs:', { 
        provinceId, 
        communeId, 
        provinceCode, 
        communeCode,
        debugInfo: {
          provincesCount: provinces.length,
          communesCount: communes.length,
          selectedProvince,
          selectedCommune,
          shippingInfo
        }
      });
      return;
    }
      
      // Transform cart items to API format
      const items: { variantId: number; colorId: number; quantity: number; price: number; discount: number }[] = transformCartToOrderItems();

      const totalAmount = items.reduce((sum: number, item) => sum + (item.price * item.quantity), 0);
      const discountAmount = items.reduce((sum: number, item) => sum + (item.discount * item.quantity), 0);

      let paymentMethod: PaymentMethodDto;
      switch (selectedPayment) {
        case 'vnpay':
          paymentMethod = { id: 1, code: 'VNPAY', name: 'VNPAY' };
          break;
        case 'cod':
          paymentMethod = { id: 2, code: 'COD', name: 'Thanh toán khi nhận hàng (COD)' };
          break;
        default:  
          paymentMethod = { id: 2, code: 'COD', name: 'Thanh toán khi nhận hàng (COD)' };
      }

      // Create order request
      const orderRequest: CreateOrderRequest = {
        totalAmount: totalAmount,
        discountAmount: discountAmount,
        shippingFee: orderSummary.shippingFee,
        finalAmount: orderSummary.grandTotal,
        recipientName: shippingInfo.fullName, 
        recipientPhone: shippingInfo.phone,
        street: shippingInfo.address,
        communeId: communeId, // Using ID instead of code
        provinceId: provinceId, // Using ID instead of code
        postalCode: '', // Optional field
        items: items,
        paymentMethod: paymentMethod,
        voucherIdsApplied: selectedVoucher ? [selectedVoucher.id] : [],
        pointUsed: pointsUsed,
      };

      console.log('🚀 Creating order with data:', {
        ...orderRequest,
        debugInfo: {
          provinceCode,
          communeCode,
          provinceName: shippingInfo.province,
          communeName: shippingInfo.commune
        }
      });

      // Call API to create order
      const response = await ordersAPI.createOrder(orderRequest);

      if (response.status === 200 && response.data?.orderId) {
        toast.success('Đơn hàng đã được tạo thành công!');
        
        // Handle different payment methods
        switch (selectedPayment) {
          case 'cod':
            // For COD, redirect to success page immediately
            router.push(`/orders/success?orderId=${response.data.orderId}`);
            break;
          case 'vnpay':
            try {
              const paymentResp = await paymentAPI.getVNPayUrl(response.data.orderId);

              if (paymentResp?.status === 200 && paymentResp.data?.paymentUrl) {
                const paymentUrl = paymentResp.data.paymentUrl;

                console.log('🌐 Redirecting to VNPay URL:', paymentUrl)
                // Redirect user to VNPay payment URL
                window.location.href = paymentUrl;
              }
            } catch (paymentError) {
              console.error('❌ VNPay payment error:', paymentError);
              toast.error('Không thể tạo liên kết thanh toán VNPay. Vui lòng thử lại sau.');
            }
            break;
          default:
            toast.error('Phương thức thanh toán không hợp lệ');
        }
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi tạo đơn hàng');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      
      // Handle specific error cases
      if (error.message.includes('401')) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      } else if (error.message.includes('400')) {
        toast.error('Dữ liệu đơn hàng không hợp lệ. Vui lòng kiểm tra lại thông tin');
      } else if (error.message.includes('503')) {
        toast.error('Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau');
      } else {
        toast.error(error.message || 'Có lỗi xảy ra khi tạo đơn hàng');
      }
    } finally {
      setIsSubmitting(false);
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
            <div className={styles.checkoutLayout}>
              {/* Left Column - Forms */}
              <div className={styles.leftColumn}>
                {/* 1. Thông tin giao hàng */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2>1. Thông tin giao hàng</h2>
                  </div>
                  <ShippingForm
                    shippingInfo={shippingInfo}
                    phoneError={phoneError}
                    onInputChange={handleInputChange}
                    provinces={provinces}
                    communes={communes}
                    selectedProvince={selectedProvince}
                    selectedCommune={selectedCommune}
                    loading={loading}
                    onProvinceChange={handleProvinceChange}
                    onCommuneChange={handleCommuneChange}
                  />
                </div>

                {/* 2. Phương thức thanh toán */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2>2. Phương thức thanh toán</h2>
                  </div>
                  <PaymentMethods
                    paymentMethods={paymentMethods}
                    selectedPayment={selectedPayment}
                    onPaymentChange={setSelectedPayment}
                  />
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className={styles.rightColumn}>
                <VoucherSelector 
                  vouchers={availableVouchers}
                  selectedVoucher={selectedVoucher}
                  onSelect={setSelectedVoucher}
                  isLoading={isLoadingVoucher}
                  subtotal={orderSummary.subtotal}
                  selectedPayment={selectedPayment}
                />

                <PointSelector 
                  userPoints={userPoints}
                  subtotal={orderSummary.subtotal}
                  onApply={handlePointsApply}
                />

                {/* 3. Tóm tắt đơn hàng */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2>3. Tóm tắt đơn hàng</h2>
                  </div>
                  <OrderSummary
                    products={cart.products}
                    orderSummary={orderSummary}
                    voucherDiscountAmount={orderSummary.voucherDiscount}
                    pointDiscountAmount={orderSummary.pointDiscount}
                  />
                </div>

                {/* 4. Nút xác nhận */}
                <div className={styles.section}>
                  <div className={styles.confirmSection}>
                    <button 
                      type="submit" 
                      className={styles.confirmOrderBtn}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                    </button>
                    <p className={styles.confirmNote}>
                      {selectedPayment === 'cod' 
                        ? 'Bạn sẽ thanh toán khi nhận hàng'
                        : `Bạn sẽ được chuyển đến cổng thanh toán ${selectedPayment.toUpperCase()}`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// Protect the checkout page with authentication
const CheckoutPage = withAuth(CheckoutPageComponent);

export default CheckoutPage;
