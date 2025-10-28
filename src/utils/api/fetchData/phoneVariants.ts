import { phoneAxiosInstance } from "./axiosInstance";
import { PhoneVariantsResponse, PhoneVariantsParams, PhoneVariantDetailResponse } from "@/utils/type/phoneVariant";

export const fetchPhoneVariants = async (
  params: PhoneVariantsParams = {}
): Promise<PhoneVariantsResponse> => {
  try {
    // Validate and sanitize parameters
    const {
      page = 1,
      limit = 10,
      order = "asc",
      brand,
      category,
      minPrice,
      maxPrice,
      search,
      chipset,
      os,
      minRam,
      maxRam,
      minStorage,
      maxStorage,
      minScreenSize,
      maxScreenSize,
      nfc,
      sort,
    } = params;

    // Validate numeric parameters
    const validatedPage = Math.max(1, page || 1);
    const validatedLimit = Math.min(Math.max(1, limit || 10), 100); // Max 100 items per page
    const validatedOrder = order === "desc" ? "desc" : "asc";

    // Build query parameters with validated values
    const queryParams = new URLSearchParams();
    queryParams.append("page", validatedPage.toString());
    queryParams.append("limit", validatedLimit.toString());
    
    if (validatedOrder) queryParams.append("order", validatedOrder);

    // Basic filters
    if (brand) queryParams.append("brand", brand);
    if (category) queryParams.append("category", category);
    // Validate and add price filters
    if (minPrice !== undefined && minPrice >= 0) {
      queryParams.append("minPrice", minPrice.toString());
    }
    if (maxPrice !== undefined && maxPrice >= 0) {
      queryParams.append("maxPrice", maxPrice.toString());
    }
    if (search && search.trim().length > 0) {
      queryParams.append("search", search.trim());
    }

    // Advanced filters
    if (chipset) {
      if (Array.isArray(chipset)) {
        chipset.forEach(c => queryParams.append("chipset", c));
      } else {
        queryParams.append("chipset", chipset);
      }
    }
    
    if (os) {
      if (Array.isArray(os)) {
        os.forEach(o => queryParams.append("os", o));
      } else {
        queryParams.append("os", os);
      }
    }
    
    // Validate and add numeric filters
    if (minRam !== undefined && minRam >= 0) {
      queryParams.append("minRam", minRam.toString());
    }
    if (maxRam !== undefined && maxRam >= 0) {
      queryParams.append("maxRam", maxRam.toString());
    }
    if (minStorage !== undefined && minStorage >= 0) {
      queryParams.append("minStorage", minStorage.toString());
    }
    if (maxStorage !== undefined && maxStorage >= 0) {
      queryParams.append("maxStorage", maxStorage.toString());
    }
    if (minScreenSize !== undefined && minScreenSize >= 0) {
      queryParams.append("minScreenSize", minScreenSize.toString());
    }
    if (maxScreenSize !== undefined && maxScreenSize >= 0) {
      queryParams.append("maxScreenSize", maxScreenSize.toString());
    }
    if (nfc !== undefined) {
      queryParams.append("nfc", nfc.toString());
    }
    if (sort && sort.trim().length > 0) {
      queryParams.append("sort", sort.trim());
    }

    const response = await phoneAxiosInstance.get(
      `/api/v1/phones/variants/filter?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching phone variants:", error);
    console.log("Request params:", params);
    console.log("Query string:", queryParams.toString());
    console.log("Full URL:", `/api/v1/phones/variants/filter?${queryParams.toString()}`);
    
    // If it's a 400 error, log more details and try with minimal params
    if (error.response?.status === 400) {
      console.error("400 Bad Request - API validation error:", error.response.data);
      console.log("This might be due to invalid parameters or API schema changes");
      console.log("🔄 Trying with minimal parameters...");
      
      try {
        // Try with only basic parameters
        const minimalParams = new URLSearchParams();
        minimalParams.append("page", "1");
        minimalParams.append("limit", "10");
        
        const response = await phoneAxiosInstance.get(
          `/api/v1/phones/variants/filter?${minimalParams.toString()}`
        );
        console.log("✅ Success with minimal parameters");
        return response.data;
      } catch (minimalError) {
        console.log("❌ Failed even with minimal parameters");
      }
    }
    
    // If it's a 404 error, try alternative endpoints
    if (error.response?.status === 404) {
      console.log("🔄 Trying alternative endpoints for 404 error...");
      
      const alternatives = [
        "/phones/variants/filter",
        "/api/phones/variants/filter", 
        "/v1/phones/variants/filter"
      ];
      
      for (const endpoint of alternatives) {
        try {
          console.log(`🔍 Trying: ${endpoint}`);
          const response = await phoneAxiosInstance.get(`${endpoint}?${queryParams.toString()}`);
          console.log(`✅ Success with: ${endpoint}`);
          return response.data;
        } catch (altError) {
          console.log(`❌ Failed: ${endpoint}`, altError.message);
        }
      }
    }
    
    throw error;
  }
};

export const fetchPhoneVariantDetail = async (
  variantId: number
): Promise<PhoneVariantDetailResponse> => {
  const endpoint = `/api/v1/phones/variants/${variantId}`;
  const fullUrl = `${phoneAxiosInstance.defaults.baseURL}${endpoint}`;
  
  console.log("🔍 fetchPhoneVariantDetail called:", {
    variantId,
    endpoint,
    fullUrl,
    baseURL: phoneAxiosInstance.defaults.baseURL
  });

  try {
    // Try the correct endpoint first
    const response = await phoneAxiosInstance.get(endpoint);
    console.log("✅ API call successful:", response.status);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching phone variant detail:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });
    
    // If it's a 404 error, try alternative endpoints
    if (error.response?.status === 404) {
      console.log("🔄 Trying alternative endpoints for 404 error...");
      
      const alternatives = [
        `/v1/phones/variants/${variantId}`,
        `/phones/variants/${variantId}`,
        `/api/phones/variants/${variantId}`
      ];
      
      for (const altEndpoint of alternatives) {
        try {
          console.log(`🔍 Trying: ${altEndpoint}`);
          const response = await phoneAxiosInstance.get(altEndpoint);
          console.log(`✅ Success with: ${altEndpoint}`);
          return response.data;
        } catch (altError) {
          console.log(`❌ Failed: ${altEndpoint}`, altError.message);
        }
      }
    }
    
    throw error;
  }
};
