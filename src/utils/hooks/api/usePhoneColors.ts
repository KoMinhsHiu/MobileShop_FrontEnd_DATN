import { useState, useEffect } from 'react';
import { fetchPhoneColors, PhoneColorResponse } from '@/utils/api/phone';

export interface UsePhoneColorsReturn {
  colors: PhoneColorResponse['data'];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePhoneColors = (): UsePhoneColorsReturn => {
  const [colors, setColors] = useState<PhoneColorResponse['data']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchPhoneColors();
      
      if (response.status === 200) {
        setColors(response.data);
      } else {
        setError(response.message || 'Failed to fetch colors');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching phone colors:', err);
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
    colors,
    isLoading,
    error,
    refetch
  };
};


