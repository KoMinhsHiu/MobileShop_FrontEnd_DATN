import axiosInstance from './fetchData/axiosInstance';
import { OrdersAPI, CreateOrderAPI, CalculateShippingFeeAPI } from '@/const/endPoint';
import { Payment } from './payment';

// API Response Types
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
  note?: string;
  createdAt: string;
}

export interface Transaction {
  id: number;
  customerId: number;
  orderId: number;
  type: string;
  points: number;
  moneyValue: number;
}

export type ShipmentStatus = 'pending' | 'processing' | 'delivered' | 'canceled' | 'failed';

export interface Shipment {
  id: number;
  orderId: number;
  provider: string;
  trackingCode: string;
  status: ShipmentStatus;
  fee: number;
  estimatedDeliveryDate: string;
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
  payments: Payment[];
}

export interface OrdersResponse {
  status: number;
  message: string;
  data: Order[]; // API trả về array trực tiếp, không phải object với orders
  errors: null;
}

export interface OrdersListResponse {
  status: number;
  message: string;
  data: {
    data: Order[];
    paging: {
      page: number;
      limit: number;
      order: string;
    };
    total: number;
  };
  errors: null;
}

// Order Creation Types
export interface CreateOrderItem {
  variantId: number;
  colorId: number;
  quantity: number;
  price: number;
  discount: number;
}

export interface PaymentMethodDto {
  id: number;
  code: string;
  name: string;
}

export interface CreateOrderRequest {
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  recipientName: string;
  recipientPhone: string;
  street: string;
  communeId: number;
  provinceId: number;
  postalCode?: string;
  voucherIdApplied?: number;
  pointUsed?: number;
  paymentMethod: PaymentMethodDto;
  items: CreateOrderItem[];
}

export interface CreateOrderResponse {
  status: number;
  message: string;
  data: {
    orderId: number;
  } | null;
  error?: {
    code: string;
    details: string;
  };
}

export interface ShippingFeeRequest {
  province: string;
  commune: string;
}

export interface ShippingFeeResponse {
  status: number;
  message: string;
  data: {
    shippingFee: string;
  };
  errors: null;
}

// API Functions
export const ordersAPI = {
  // Get user's orders
  getMyOrders: async (): Promise<OrdersResponse> => {
    try {
      const response = await axiosInstance.get(`${OrdersAPI}/me`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  // List orders with pagination
  listOrders: async (page: number, limit: number): Promise<OrdersListResponse> => {
    try {
      // Get JWT token from localStorage (using phonehub_tokens key)
      let token = null;
      try {
        const tokens = localStorage.getItem('phonehub_tokens');
        if (tokens) {
          const tokenData = JSON.parse(tokens);
          token = tokenData.accessToken || tokenData.access_token || tokenData.token;
        }
      } catch (error) {
        console.error('Error parsing token data:', error);
      }
      
      // Check if token exists
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await axiosInstance.get(`${OrdersAPI}/list`, {
        params: { page, limit },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching orders list:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch orders list');
    }
  },

  // List customer orders with pagination
  listCustomerOrders: async (page: number, limit: number): Promise<OrdersListResponse> => {
    try {
      // Get JWT token from localStorage (using phonehub_tokens key)
      let token = null;
      try {
        const tokens = localStorage.getItem('phonehub_tokens');
        if (tokens) {
          const tokenData = JSON.parse(tokens);
          token = tokenData.accessToken || tokenData.access_token || tokenData.token;
        }
      } catch (error) {
        console.error('Error parsing token data:', error);
      }
      
      // Check if token exists
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await axiosInstance.get(`${OrdersAPI}/me/list`, {
        params: { page, limit },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;      
    } catch (error: any) {
      console.error('Error fetching customer orders list:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch customer orders list');
    }
  },

  // Get order by ID
  getOrderById: async (orderId: number): Promise<{ status: number; message: string; data: { order: Order } }> => {
    try {
      const response = await axiosInstance.get(`${OrdersAPI}/${orderId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching order:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  },

  // Create new order
  createOrder: async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
    try {
      const response = await axiosInstance.post(CreateOrderAPI, orderData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<void> => {
    try {
      let token = null;
      try {
        const tokens = localStorage.getItem('phonehub_tokens');
        if (tokens) {
          const tokenData = JSON.parse(tokens);
          token = tokenData.accessToken || tokenData.access_token || tokenData.token;
        }
      } catch (error) {
        console.error('Error parsing token data:', error);
      }
      
      // Check if token exists
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      await axiosInstance.put(`${OrdersAPI}/status/${orderId}`,
        { status },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
    } catch (error: any) {
      console.error('Error updating order status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  },
};

export default ordersAPI;

export const shippingAPI = {
  calculateShippingFee: async (data: ShippingFeeRequest): Promise<ShippingFeeResponse> => {
    try {
      const response = await axiosInstance.post(CalculateShippingFeeAPI, data);
      return response.data;
    } catch (error: any) {
      console.error('Error calculating shipping fee:', error);
      throw new Error(error.response?.data?.message || 'Failed to calculate shipping fee');
    }
  }
};