import { phoneAxiosInstance } from './fetchData/axiosInstance';

// Types for Cart API
export interface AddToCartRequest {
  variantId: number;
  colorId: number;
  quantity: number;
  price: number;
  discount: number;
}

export interface AddToCartResponse {
  status: number;
  message: string;
  data: {
    cartItemId: number;
  };
}

export interface CartApiError {
  status: number;
  message: string;
  data: null;
  errors?: {
    [key: string]: string;
  };
}

// Types for Get Cart API
export interface CartVariant {
  id: number;
  phoneId: number;
  variantName: string;
  color: string;
  name: string;
  imageUrl: string;
}

export interface CartItem {
  id: number;
  cartId: number;
  quantity: number;
  price: number;
  discount: number;
  variant: CartVariant;
}

export interface CartData {
  id: number;
  customerId: number;
  items: CartItem[];
}

export interface GetCartResponse {
  status: number;
  message: string;
  data: CartData;
}

class CartAPI {
  /**
   * Add item to cart
   */
  async addToCart(request: AddToCartRequest): Promise<AddToCartResponse> {
    try {
      console.log('🛒 Add to cart request body:', JSON.stringify(request, null, 2));
      const response = await phoneAxiosInstance.post<AddToCartResponse>(
        '/api/v1/cart/add',
        request
      );
      console.log('✅ Add to cart response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      // Handle different error responses
      if (error.response?.data) {
        throw error.response.data as CartApiError;
      }
      
      // If it's a 404, 503, or network error, try alternative endpoints
      if (error.response?.status === 404 || error.response?.status === 503 || error.code === 'ERR_NETWORK') {
        console.log('🔄 Add to cart API unavailable, trying alternative endpoints...');
        
        const alternatives = [
          '/api/v1/cart/add',
          '/api/cart/add',
          '/cart/add'
        ];
        
        for (const endpoint of alternatives) {
          try {
            console.log(`🔍 Trying add to cart endpoint: ${endpoint}`);
            const response = await phoneAxiosInstance.post(`${endpoint}`, request);
            console.log(`✅ Success with: ${endpoint}`);
            return response.data;
          } catch (altError) {
            console.log(`❌ Failed: ${endpoint}`, typeof altError === 'object' && altError !== null && 'message' in altError ? (altError as any).message : altError);
          }
        }
      }
      
      throw {
        status: 500,
        message: 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng',
        data: null
      } as CartApiError;
    }
  }

  /**
   * Get current user's cart
   */
  async getCart(): Promise<GetCartResponse> {
    try {
      const response = await phoneAxiosInstance.get<GetCartResponse>(
        '/api/v1/cart/me'
      );
      return response.data;
    } catch (error: any) {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response?.status === 401 || error.status === 401) {
        console.log('🔐 Cart API: Token expired or invalid, clearing auth data');
        localStorage.removeItem('phonehub_tokens');
        localStorage.removeItem('phonehub_user');
        // Trigger page reload to reset auth state
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }
      
      // Handle different error responses
      if (error.response?.data) {
        throw error.response.data as CartApiError;
      }
      
      // If it's a 404, 503, or network error, try alternative endpoints
      if (error.response?.status === 404 || error.response?.status === 503 || error.code === 'ERR_NETWORK') {
        console.log('🔄 Cart API unavailable (404/503/network), trying alternative endpoints...');
        
        const alternatives = [
          '/v1/cart/me',
          '/api/cart/me',
          '/cart/me'
        ];
        
        for (const endpoint of alternatives) {
          try {
            console.log(`🔍 Trying cart endpoint: ${endpoint}`);
            const response = await phoneAxiosInstance.get(`${endpoint}`);
            console.log(`✅ Success with: ${endpoint}`);
            return response.data;
          } catch (altError) {
            console.log(`❌ Failed: ${endpoint}`, typeof altError === 'object' && altError !== null && 'message' in altError ? (altError as any).message : altError);
          }
        }
      }
      
      throw {
        status: 500,
        message: 'Có lỗi xảy ra khi lấy thông tin giỏ hàng',
        data: null
      } as CartApiError;
    }
  }
}

export const cartAPI = new CartAPI();
