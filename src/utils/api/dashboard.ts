import { DashboardStatAPI } from "@/const/endPoint";
import axiosInstance from "./fetchData/axiosInstance";

// Revenue Data Interfaces
export interface RevenueDataPoint {
  label: string;
  value: number;
  date: string;
}

export interface RevenueByPeriod {
  total: number;
  data: RevenueDataPoint[];
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
}

// Payment Methods Interface
export interface PaymentMethodStats {
  [key: string]: number;
}

// Order Status Interface
export interface OrderStatusStats {
  [key: string]: number;
}

// Best Selling Product Interface
export interface BestSellingProduct {
  variantName: string;
  totalSoldQuantity: number;
  revenue: number;
}

// Main Dashboard Analytics Interface
export interface DashboardAnalytics {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  thisMonthOrders: number;
  totalRevenue: number;
  thisMonthRevenue: number;
  revenueByPeriod: RevenueByPeriod;
  paymentMethods: PaymentMethodStats;
  orderStatuses: OrderStatusStats;
  top10BestSellingProducts: BestSellingProduct[];
}

// API Response Interface
export interface DashboardAnalyticsResponse {
  status: number;
  message: string;
  data: DashboardAnalytics;
  errors: any;
}

// Dashboard API Functions
export const dashboardAPI = {
  getDashboardAnalytics: async (startDate?: string, endDate?: string): Promise<DashboardAnalytics> => {
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

      // Prepare request body
      const requestBody: any = {};
      if (startDate && endDate) {
        requestBody.startDate = startDate;
        requestBody.endDate = endDate;
      }

      const response = await axiosInstance.post<DashboardAnalyticsResponse>(`${DashboardStatAPI}`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching dashboard analytics:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard analytics');
    }
  },
};

export default dashboardAPI;