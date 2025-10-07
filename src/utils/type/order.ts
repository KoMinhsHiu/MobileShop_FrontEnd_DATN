export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
  attributes: { key: string };
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  note: string;
}

export interface OrderSummary {
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'paypal' | 'momo' | 'vnpay';
  shippingInfo: ShippingInfo;
  items: OrderItem[];
  summary: OrderSummary;
}

export interface OrderStatus {
  pending: {
    label: string;
    color: string;
    icon: string;
  };
  confirmed: {
    label: string;
    color: string;
    icon: string;
  };
  shipping: {
    label: string;
    color: string;
    icon: string;
  };
  delivered: {
    label: string;
    color: string;
    icon: string;
  };
  cancelled: {
    label: string;
    color: string;
    icon: string;
  };
}
