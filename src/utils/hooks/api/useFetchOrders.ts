import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { ordersAPI, Order } from '@/utils/api/orders';
import toast from 'react-hot-toast';

interface UseFetchOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFetchOrders = (): UseFetchOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchOrders = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await ordersAPI.getMyOrders();
      
      console.log('🔍 Orders API Response:', response);
      console.log('🔍 Response Data:', response.data);
      console.log('🔍 Data Type:', Array.isArray(response.data) ? 'Array' : typeof response.data);
      console.log('🔍 Data Length:', response.data?.length || 0);
      
      if (response.status === 200) {
        // API trả về data là array trực tiếp, không phải object với orders
        const ordersArray = response.data || [];
        
        // Debug: Log each order's orderDate
        console.log('📅 Orders with dates:');
        ordersArray.forEach((order: any, index: number) => {
          console.log(`📅 Order ${index + 1}:`, {
            id: order.id,
            orderCode: order.orderCode,
            orderDate: order.orderDate,
            rawOrderDate: JSON.stringify(order.orderDate)
          });
        });
        
        console.log('🔍 Setting orders:', ordersArray);
        setOrders(ordersArray);
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      
      // Handle specific error cases
      let errorMessage = 'Có lỗi xảy ra khi tải đơn hàng';
      
      if (err.message.includes('404') || err.message.includes('Provinces not found')) {
        errorMessage = 'API đơn hàng đang được cập nhật. Vui lòng thử lại sau.';
        console.warn('Orders API temporarily unavailable - likely due to backend update');
      } else if (err.message.includes('401')) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (err.message.includes('403')) {
        errorMessage = 'Bạn không có quyền truy cập vào đơn hàng.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Show toast notification for user feedback (only for non-404 errors)
      if (!err.message.includes('404') && !err.message.includes('Provinces not found')) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated]);

  return {
    orders,
    loading,
    error,
    refetch
  };
};

export default useFetchOrders;
