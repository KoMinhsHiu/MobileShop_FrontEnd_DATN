import { useQuery } from "@tanstack/react-query";
import { fetchPhoneVariants } from "@/utils/api/fetchData/phoneVariants";
import { PhoneVariantsResponseTransformer } from "@/utils/api/transformer/phoneVariant";
import { PhoneVariantsParams } from "@/utils/type/phoneVariant";

export const useFetchPhoneVariants = (params: PhoneVariantsParams = {}) => {
  return useQuery({
    queryKey: ["phoneVariants", params],
    queryFn: async () => {
      try {
        const response = await fetchPhoneVariants(params);
        const transformedData = PhoneVariantsResponseTransformer(response);
        return transformedData;
      } catch (error) {
        console.warn("API not available, returning empty data:", error);
        // Return empty data structure when API fails
        return {
          products: [],
          totalProducts: 0,
          totalPages: 0,
          currentPage: params.page || 1,
          paging: {
            page: params.page || 1,
            limit: params.limit || 10,
            order: params.order || "asc"
          }
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry on 404 errors
    keepPreviousData: true, // Keep previous data while fetching new data
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
};
