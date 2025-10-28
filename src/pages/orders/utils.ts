// Import timelineSteps from mockData
import { timelineSteps } from './mockData';

// Utility functions for orders
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getPaymentMethodLabel = (method: string): string => {
  const methods: { [key: string]: string } = {
    cod: "Thanh toán khi nhận hàng",
    paypal: "PayPal",
    momo: "Momo",
    vnpay: "VNPay"
  };
  return methods[method] || method;
};

export const getCurrentStepIndex = (status: string): number => {
  const stepIndex = timelineSteps.findIndex(step => step.key === status);
  return stepIndex >= 0 ? stepIndex : 0;
};
