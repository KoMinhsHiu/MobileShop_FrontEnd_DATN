import phonesAPI, { Phone } from "@/utils/api/phone";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UseFetchPhoneDetailReturn {
  loading: boolean;
  error: Error | null;
  phone: Phone | null;
}

export const useFetchPhoneDetail = (phoneId: number): UseFetchPhoneDetailReturn => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [phone, setPhone] = useState<Phone | null>(null);

  const fetchPhoneDetail = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await phonesAPI.getPhoneById(id);

      console.log('🔍 Phone API Response:', response);
      console.log('🔍 Response Data:', response.data);
      console.log('🔍 Data Type:', Array.isArray(response.data) ? 'Array' : typeof response.data);

      if (response.status === 200) {
        setPhone(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch phone details');
      }
    } catch (err: any) {
      console.error('Error fetching phone details:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));

      if (!err.message.includes('404') && !err.message.includes('Provinces not found')) {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (phoneId) {
      fetchPhoneDetail(phoneId);
    }
  }, [phoneId]);

  return { loading, error, phone };
};

export default useFetchPhoneDetail;
