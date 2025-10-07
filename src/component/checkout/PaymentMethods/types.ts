export interface PaymentMethod {
  type: 'cod' | 'paypal' | 'momo' | 'vnpay';
  label: string;
}
