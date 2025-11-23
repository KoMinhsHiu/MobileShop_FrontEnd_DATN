import { useState, useEffect, useCallback } from 'react';
import { fetchPhoneList, PhoneListResponse } from '@/utils/api/phone';

export interface PhoneListParams {
  page: number;
  limit: number;
}

export interface UsePhoneListReturn {
  phones: PhoneListResponse['data']['data'];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePhoneList = (params: PhoneListParams): UsePhoneListReturn => {
  const [phones, setPhones] = useState<PhoneListResponse['data']['data']>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { page, limit } = params;
      const response = await fetchPhoneList(page, limit);
      
      if (response.status === 200) {
        setPhones(response.data.data);
        setTotal(response.data.total);
      } else {
        setError(response.message || 'Failed to fetch phones');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching phone list:', err);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return {
    phones,
    total,
    isLoading,
    error,
    refetch
  };
};
