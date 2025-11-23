import { useQuery } from "@tanstack/react-query";
import { cartAPI } from "@/utils/api/cart";
import { useAuth } from "@/context/authContext";

export const useFetchCart = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      try {
        const response = await cartAPI.getCart();
        console.log("✅ Cart API successful:", response);
        return response.data;
      } catch (error: any) {
        console.warn("Cart API not available, returning empty cart:", error);
        
        // Log error details for debugging
        console.log("Cart API error details:", JSON.stringify({
          status: error.status,
          statusCode: error.statusCode,
          message: error.message,
          response: error.response,
          responseData: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL
          }
        }, null, 2));
        
        // Handle different error types
        if (error.status === 401 || error.statusCode === 401) {
          console.log("🔐 Authentication failed - token may be expired or invalid");
          console.log("Current token from localStorage:", localStorage.getItem('phonehub_tokens'));
        } else if (error.status === 503 || error.statusCode === 503) {
          console.log("🚫 Cart service temporarily unavailable (503)");
          console.log("Server may be under maintenance or overloaded");
        } else if (error.status === 404 || error.statusCode === 404) {
          console.log("❓ Cart endpoint not found (404)");
          console.log("API endpoint may not be implemented yet");
        }
        
        // Return empty cart structure when API fails
        return {
          id: 0,
          customerId: 0,
          items: []
        };
      }
    },
    enabled: isAuthenticated, // Only fetch when user is authenticated
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: false, // Don't retry on errors
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Always refetch when component mounts
  });
};
