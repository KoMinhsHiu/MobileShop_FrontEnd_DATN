import { VNPayAPI } from "@/const/endPoint"
import axiosInstance from "../fetchData/axiosInstance"

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
  }
}