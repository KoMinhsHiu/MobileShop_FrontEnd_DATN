import { VouchersAPI } from "@/const/endPoint";
import axiosInstance from "./fetchData/axiosInstance";
import { PaymentMethod } from "./payment";

export interface VoucherCategory {
  voucherId: number;
  category: {
    id: number;
    name: string;
    parentId?: number | null;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
  };
}

export interface VoucherPaymentMethod {
  voucherId: number;
  paymentMethod: PaymentMethod;
}

export interface Voucher {
  id: number;
  code: string;
  title: string;
  description: string;
  discountType: 'percent' | 'amount';
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue: number;
  startDate: string;
  endDate?: string;
  usageLimit: number;
  usageLimitPerUser: number;
  usedCount: number;
  appliesTo: 'all' | 'category' | 'payment_method';
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  categories?: VoucherCategory[];
  paymentMethods?: VoucherPaymentMethod[];    
}

export interface ListVouchersResponse {
  status: number;
  message: string;
  data: {
    data: Voucher[];
    paging: {
      page: number;
      limit: number;
      order: 'asc' | 'desc';
    };
    total: number;
  };
}

export interface CreateVoucherRequest {
  description: string;
  title: string;
  code: string;
  discountType: 'percent' | 'amount';
  discountValue: number;
  minOrderValue: number;
  maxDiscountValue: number;
  usageLimit: number;
  usageLimitPerUser: number;
  appliesTo: 'all' | 'category' | 'payment_method';
  startDate: Date;
  endDate: Date | null;
  categories?: number[];
  paymentMethods?: number;
}

export interface UpdateVoucherRequest {
  description?: string;
  title?: string;
  endDate?: Date | null;
}

export const voucherAPI = {
  listVouchers: async (page?: number, limit?: number): Promise<ListVouchersResponse> => {
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

      const response = await axiosInstance.get(`${VouchersAPI}/list`, {
        params: {
          page : page || 1,
          limit: limit || 10
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching vouchers:', error);
      throw error;
    }
  },

  createVoucher: async (data: CreateVoucherRequest): Promise<void> => {
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

      await axiosInstance.post(`${VouchersAPI}`,
        { ...data },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error creating voucher:', error);
      throw new Error(error.response?.data?.message || 'Failed to create voucher');
    }
  },

  updateVoucher: async (voucherId: number, data: UpdateVoucherRequest): Promise<void> => {
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

      await axiosInstance.put(`${VouchersAPI}/${voucherId}`,
        { ...data },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error updating voucher:', error);
      throw new Error(error.response?.data?.message || 'Failed to update voucher');
    }
  },
}