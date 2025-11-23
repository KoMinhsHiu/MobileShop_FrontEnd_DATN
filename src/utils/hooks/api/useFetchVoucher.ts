import { useState, useEffect, useCallback } from 'react';
import { voucherAPI, Voucher, ListVouchersResponse } from '@/utils/api/voucher';
import { useToast } from '@/component/common/ToastContainer';

interface UseFetchVoucherReturn {
  vouchers: Voucher[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
}

interface UseFetchVoucherProps {
  page?: number;
  limit?: number;
}

export const useFetchVoucher = ({ 
  page = 1, 
  limit = 10 
}: UseFetchVoucherProps = {}): UseFetchVoucherReturn => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const { showError } = useToast();

  const fetchVouchers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching vouchers with params:', { page, limit });
      
      const response: ListVouchersResponse = await voucherAPI.listVouchers(page, limit);
      
      console.log('🎫 Vouchers API Response:', response);
      console.log('🎫 Response Data:', response.data);
      console.log('🎫 Vouchers Array:', response.data.data);
      console.log('🎫 Total Count:', response.data.total);
      
      if (response.status === 200) {
        const vouchersArray = response.data.data || [];
        const totalCount = response.data.total || 0;
        
        // Debug: Log each voucher's key info
        console.log('🎫 Vouchers with details:');
        vouchersArray.forEach((voucher: Voucher, index: number) => {
          console.log(`🎫 Voucher ${index + 1}:`, {
            id: voucher.id,
            code: voucher.code,
            title: voucher.title,
            discountType: voucher.discountType,
            discountValue: voucher.discountValue,
            startDate: voucher.startDate,
            endDate: voucher.endDate,
            appliesTo: voucher.appliesTo
          });
        });
        
        console.log('🎫 Setting vouchers:', vouchersArray);
        setVouchers(vouchersArray);
        setTotal(totalCount);
      } else {
        throw new Error(response.message || 'Failed to fetch vouchers');
      }
    } catch (err: any) {
      console.error('❌ Error fetching vouchers:', err);
      
      // Handle specific error cases
      let errorMessage = 'Có lỗi xảy ra khi tải danh sách voucher';
      
      if (err.message?.includes('404')) {
        errorMessage = 'API voucher đang được cập nhật. Vui lòng thử lại sau.';
        console.warn('Vouchers API temporarily unavailable - likely due to backend update');
      } else if (err.message?.includes('401')) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (err.message?.includes('403')) {
        errorMessage = 'Bạn không có quyền truy cập vào danh sách voucher.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Show toast notification for user feedback (only for non-404 errors)
      if (!err.message?.includes('404')) {
        showError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, showError]);

  const refetch = async () => {
    await fetchVouchers();
  };

  useEffect(() => {
    fetchVouchers();
  }, [page, limit, fetchVouchers]);

  return {
    vouchers,
    loading,
    error,
    total,
    refetch
  };
};

export default useFetchVoucher;
