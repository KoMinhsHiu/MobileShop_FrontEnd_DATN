// Legacy types for backward compatibility
export interface LegacyOrderItem {
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

// New API-compatible types
export interface OrderItem {
  id: number;
  orderId: number;
  quantity: number;
  price: number;
  discount: number;
  variant: {
    id: number;
    phoneId: number;
    variantName: string;
    color: string;
    name: string;
    imageUrl: string;
  };
}

export interface Commune {
  id: number;
  name: string;
}

export interface Province {
  id: number;
  name: string;
}

export interface StatusHistory {
  id: number;
  orderId: number;
  status: string;
  note: string | null;
}

export interface Transaction {
  id: number;
  customerId: number;
  orderId: number;
  type: string;
  points: number;
  moneyValue: number;
}

export interface Shipment {
  id: number;
  orderId: number;
  carrier: string;
  trackingNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  customerId: number;
  orderCode: string;
  orderDate: string;
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  recipientName: string;
  recipientPhone: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'canceled' | 'failed';
  street: string;
  commune: Commune;
  province: Province;
  postalCode: string;
  items: OrderItem[];
  statusHistory: StatusHistory[];
  transactions: Transaction[];
  shipments: Shipment[];
}

// Legacy Order type for backward compatibility
export interface LegacyOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'paypal' | 'momo' | 'vnpay';
  shippingInfo: ShippingInfo;
  items: LegacyOrderItem[];
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
