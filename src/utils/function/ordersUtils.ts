// Utility functions for orders
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const getPaymentMethodLabel = (method: string): string => {
  const methods: { [key: string]: string } = {
    cod: "Thanh toán khi nhận hàng",
    paypal: "PayPal",
    momo: "Momo",
    vnpay: "VNPay",
    undefined: "Chưa chọn phương thức thanh toán"
  };
  return methods[method] || method;
};
