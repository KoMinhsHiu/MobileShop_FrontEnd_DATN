import { useQuery } from "@tanstack/react-query";
import { fetchPhoneVariantDetail } from "@/utils/api/fetchData/phoneVariants";
import { PhoneVariantDetailTransformer } from "@/utils/api/transformer/phoneVariant";
import { ProductType } from "@/utils/type";

interface UseFetchPhoneVariantDetailProps {
  variantId: number;
  initialData?: ProductType;
}

export const useFetchPhoneVariantDetail = ({ 
  variantId, 
  initialData 
}: UseFetchPhoneVariantDetailProps) => {
  return useQuery({
    queryKey: ["phoneVariantDetail", variantId],
    queryFn: async () => {
      try {
        const response = await fetchPhoneVariantDetail(variantId);
        const transformedData = PhoneVariantDetailTransformer(response);
        return transformedData;
      } catch (error) {
        console.warn("API not available, returning initial data:", error);
        // Return initial data when API fails
        return initialData || null;
      }
    },
    enabled: !!variantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on 404 errors
    refetchOnWindowFocus: false, // Don't refetch on window focus
    initialData: undefined,
  });
};
