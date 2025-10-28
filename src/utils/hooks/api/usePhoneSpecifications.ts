import { useState, useEffect } from 'react';
import { fetchPhoneSpecifications, PhoneSpecificationResponse } from '@/utils/api/phone';

export interface UsePhoneSpecificationsReturn {
  specifications: PhoneSpecificationResponse['data'];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePhoneSpecifications = (): UsePhoneSpecificationsReturn => {
  const [specifications, setSpecifications] = useState<PhoneSpecificationResponse['data']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchPhoneSpecifications();
      
      if (response.status === 200) {
        setSpecifications(response.data);
      } else {
        setError(response.message || 'Failed to fetch specifications');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching phone specifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return {
    specifications,
    isLoading,
    error,
    refetch
  };
};


