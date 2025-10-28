import { useState } from 'react';
import { createPhoneVariant, CreateVariantRequest, CreateVariantResponse } from '@/utils/api/phone';

export interface UseCreatePhoneVariantReturn {
  createVariant: (data: CreateVariantRequest) => Promise<CreateVariantResponse>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

export const useCreatePhoneVariant = (): UseCreatePhoneVariantReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createVariant = async (data: CreateVariantRequest): Promise<CreateVariantResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await createPhoneVariant(data);
      
      if (response.status === 201) {
        setSuccess(true);
        return response;
      } else {
        throw new Error(response.message || 'Failed to create phone variant');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error creating phone variant:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  return {
    createVariant,
    isLoading,
    error,
    success,
    reset
  };
};


