import axiosInstance from './fetchData/axiosInstance';
import { CustomerAPI, CustomerMeAPI } from '@/const/endPoint';

// API Response Types
export interface CustomerUser {
  id: number;
  username: string;
  email: string;
  phone: string;
  status?: 'active' | 'inactive' | 'banned';
  lastChangePass?: string;
}

export interface CustomerData {
  id: number;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  pointsBalance: number;
  user: CustomerUser;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface CustomerMeResponse {
  status: number;
  message: string;
  data: CustomerData;
  errors: null;
}

// Update Customer Request Type
export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface UpdateCustomerResponse {
  status: number;
  message: string;
  data: CustomerData;
  errors: null;
}

export interface ListCustomersResponse {
  status: number;
  message: string;
  data: {
    data: CustomerData[];
    paging: {
      page: number;
      limit: number;
      order: 'asc' | 'desc';
    };
    total: number;
  };
}

export interface UpdateUserResponse {
  status: number;
  message: string;
  data: { success: boolean };
  errors: null;
}

// API Functions
export const customerAPI = {
  listCustomers: async (page?: number, limit?: number): Promise<ListCustomersResponse> => {
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

      const response = await axiosInstance.get(`${CustomerAPI}/list`, {
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
      console.error('Error fetching customers:', error);
      throw error;
    }
  },
  // Get current customer info
  getMe: async (): Promise<CustomerMeResponse> => {
    try {
      console.log('👤 Fetching customer info...');
      console.log('📍 API Endpoint:', CustomerMeAPI);
      console.log('🌐 Base URL:', axiosInstance.defaults.baseURL);
      console.log('🔗 Full URL:', `${axiosInstance.defaults.baseURL}${CustomerMeAPI}`);
      
      const response = await axiosInstance.get(CustomerMeAPI);
      
      console.log('✅ Customer API Response received:');
      console.log('📊 Status:', response.status);
      console.log('📋 Data:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Customer API Error occurred:');
      console.error('🔍 Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          timeout: error.config?.timeout
        }
      });
      
      // Handle different types of errors
      if (error.code === 'ECONNABORTED') {
        throw new Error('Kết nối timeout. Vui lòng kiểm tra API server có đang chạy không.');
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('Không thể kết nối đến API server. Vui lòng kiểm tra server có đang chạy không.');
      } else if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Không thể lấy thông tin người dùng';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Something else happened
        throw new Error('Có lỗi xảy ra khi lấy thông tin người dùng: ' + error.message);
      }
    }
  },

  // Update customer info
  updateMe: async (updateData: UpdateCustomerRequest): Promise<UpdateCustomerResponse> => {
    try {
      console.log('📝 Updating customer info...');
      console.log('📍 API Endpoint:', CustomerMeAPI);
      console.log('📤 Request Data:', updateData);
      
      const response = await axiosInstance.put(CustomerMeAPI, updateData);
      
      console.log('✅ Update Customer API Response received:');
      console.log('📊 Status:', response.status);
      console.log('📋 Data:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Update Customer API Error occurred:');
      console.error('🔍 Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // Handle different types of errors
      if (error.code === 'ECONNABORTED') {
        throw new Error('Kết nối timeout. Vui lòng kiểm tra API server có đang chạy không.');
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('Không thể kết nối đến API server. Vui lòng kiểm tra server có đang chạy không.');
      } else if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Không thể cập nhật thông tin';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Something else happened
        throw new Error('Có lỗi xảy ra khi cập nhật thông tin: ' + error.message);
      }
    }
  }
};

export default customerAPI;





