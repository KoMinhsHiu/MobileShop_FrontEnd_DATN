import { PaymentAPI, VNPayAPI } from "@/const/endPoint"
import axiosInstance from "./fetchData/axiosInstance"

export interface PaymentMethod {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface Payment {
  id: number;
  orderId: number;
  transactionId: number;
  status: PaymentStatus;
  amount: number;
  paymentMethod: PaymentMethod;
  payDate?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface VNPayResponse {
  status: number;
  message: string;
  data: {
    paymentUrl: string;
  };
  errors: null;
}

export const paymentAPI = {
  getVNPayUrl: async (orderId: number): Promise<VNPayResponse> => {
    try {
      const response = await axiosInstance.post(VNPayAPI, {
        paymentMethodId: 1,
        orderId,
      }); 
      return response.data;
    } catch (error: any) {
      console.error('Error creating VNPay payment URL:', error);
      throw new Error(error.response?.data?.message || 'Failed to create VNPay payment URL');
    }
  },

  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    try {
      const response = await axiosInstance.get(`${PaymentAPI}/methods`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch payment methods');
    }
  },
}