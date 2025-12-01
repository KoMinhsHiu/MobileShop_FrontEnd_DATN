import axiosInstance from './fetchData/axiosInstance';
import { RegisterAPI, LoginAPI, LogoutAPI, GoogleOAuthAPI, AuthAPI } from '@/const/endPoint';

// Types for API requests and responses
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone: string;
  roleId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface CreateAdminUserRequest {
  username: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterResponse {
  status: number;
  message: string;
  data: {
    userId: number;
    tokens: AuthTokens;
  };
  errors: null;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    userId: number;
    tokens: AuthTokens;
  };
  errors: null;
}

export interface LogoutResponse {
  status: number;
  message: string;
  data: null;
  errors: null;
}


// API functions
export const authAPI = {
  // Register new user
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      console.log('🚀 Attempting to register user...');
      console.log('📍 API Endpoint:', RegisterAPI);
      console.log('🌐 Base URL:', axiosInstance.defaults.baseURL);
      console.log('📤 Request Data:', userData);
      console.log('🔗 Full URL:', `${axiosInstance.defaults.baseURL}${RegisterAPI}`);
      
      const response = await axiosInstance.post(RegisterAPI, userData);
      
      console.log('✅ API Response received:');
      console.log('📊 Status:', response.status);
      console.log('📋 Data:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ API Error occurred:');
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
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Đăng ký thất bại';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Something else happened
        throw new Error('Có lỗi xảy ra khi đăng ký: ' + error.message);
      }
    }
  },

  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log('🔐 Attempting to login user...');
      console.log('📍 API Endpoint:', LoginAPI);
      console.log('🌐 Base URL:', axiosInstance.defaults.baseURL);
      console.log('🔗 Full URL:', `${axiosInstance.defaults.baseURL}${LoginAPI}`);
      console.log('📋 Request data:', credentials);
      
      const response = await axiosInstance.post(LoginAPI, credentials);
      
      console.log('✅ Login API Response received:');
      console.log('📊 Status:', response.status);
      console.log('📋 Data:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Login API Error occurred:');
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
          timeout: error.config?.timeout,
          fullURL: `${error.config?.baseURL}${error.config?.url}`
        }
      });
      
      // Handle different types of errors
      if (error.code === 'ECONNABORTED') {
        throw new Error('Kết nối timeout. Vui lòng kiểm tra API server có đang chạy không.');
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('Không thể kết nối đến API server. Vui lòng kiểm tra server có đang chạy không.');
      } else if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.errors[0]?.message;
        throw new Error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Something else happened
        throw new Error('Có lỗi xảy ra khi đăng nhập: ' + error.message);
      }
    }
  },

  // Logout user
  logout: async (accessToken: string): Promise<LogoutResponse> => {
    try {
      console.log('🚪 Attempting to logout user...');
      console.log('📍 API Endpoint:', LogoutAPI);
      console.log('🔑 Using access token:', accessToken.substring(0, 20) + '...');
      
      const response = await axiosInstance.post(LogoutAPI, {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      console.log('✅ Logout API Response received:');
      console.log('📊 Status:', response.status);
      console.log('📋 Data:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Logout API Error occurred:');
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
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Đăng xuất thất bại';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        // Something else happened
        throw new Error('Có lỗi xảy ra khi đăng xuất: ' + error.message);
      }
    }
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<any> => {
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

      const response = await axiosInstance.post(`${AuthAPI}/change-password`,{
        currentPassword: oldPassword,
        newPassword: newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Change Password Error occurred:', error);
      throw new Error(error.response?.data?.errors?.[0]?.message || 'Có lỗi xảy ra khi đổi mật khẩu: ' + error.message);
    }
  },

  // Google OAuth login
  googleOAuth: async (): Promise<void> => {
    try {
      console.log('🌐 Redirecting to Google OAuth...');
      console.log('📍 API Endpoint:', GoogleOAuthAPI);
      console.log('🌐 Base URL:', axiosInstance.defaults.baseURL);
      console.log('🔗 Full URL:', `${axiosInstance.defaults.baseURL}${GoogleOAuthAPI}`);

      window.location.href = `${axiosInstance.defaults.baseURL}${GoogleOAuthAPI}`;
    } catch (error: any) {
      console.error('❌ Google OAuth Error occurred:');
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
    }
  },

  googleOAuthCallback: async (code: string) => {
    try {
      console.log('🔄 Handling Google OAuth callback...');
      console.log('📍 API Endpoint:', `${GoogleOAuthAPI}/callback`);
      console.log('🌐 Base URL:', axiosInstance.defaults.baseURL);
      console.log('🔗 Full URL:', `${axiosInstance.defaults.baseURL}${GoogleOAuthAPI}/callback`);
      console.log('📋 Authorization code:', code);

      const response = await axiosInstance.post(`${GoogleOAuthAPI}/callback`, { code });
      console.log('✅ Google OAuth Callback Response received:');
      console.log('📊 Status:', response.status);
      console.log('📋 Data:', response.data);

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return error.response.data;
      }

      console.error('❌ Google OAuth Callback Error occurred:');
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

      throw new Error('Có lỗi xảy ra trong quá trình xác thực Google: ' + error.message);
    }
  },

  getCurrentAdmin: async () => {
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

      const response = await axiosInstance.get(`${AuthAPI}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Get Current Admin Error occurred:', error);
      throw new Error('Có lỗi xảy ra khi lấy thông tin người dùng hiện tại: ' + error.message);
    }
  },

  updateAdminProfile: async (username: string) => {
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

      const response = await axiosInstance.put(`${AuthAPI}/user/me`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Update Admin Profile Error occurred:', error);
      throw new Error('Có lỗi xảy ra khi cập nhật thông tin người dùng: ' + error.message);
    }
  },

  createAdminUser: async (userData: CreateAdminUserRequest) => {
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

      const response = await axiosInstance.post(`${AuthAPI}/user`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Create Admin User Error occurred:', error);
      throw new Error('Có lỗi xảy ra khi tạo người dùng quản trị: ' + error.message);
    }
  },

  updateUserStatus: async (userId: string, status: string): Promise<void> => {
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
      
      console.log('🔄 Updating user status...');

      const response = await axiosInstance.post(`${AuthAPI}/status/${userId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('✅ Update User Status Response received:');
      console.log('📊 Status:', response.status);
      console.log('📋 Data:', response.data);
    } catch (error: any) {
      console.error('❌ Update User Status Error occurred:', error);
      throw new Error('Có lỗi xảy ra khi cập nhật trạng thái người dùng: ' + error.message);
    }
  }
};
