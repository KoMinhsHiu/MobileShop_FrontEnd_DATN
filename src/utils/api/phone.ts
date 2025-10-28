// Phone API interfaces and functions
export interface PhoneBrand {
  id: number;
  name: string;
  image: {
    id: number;
    imageUrl: string;
  };
}

export interface PhoneCategory {
  id: number;
  name: string;
  parentId: number;
}

export interface Phone {
  id: number;
  name: string;
  brand: PhoneBrand;
  category: PhoneCategory;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface PhoneListResponse {
  status: number;
  message: string;
  data: {
    data: Phone[];
    paging: {
      page: number;
      limit: number;
      order: 'asc' | 'desc';
    };
    total: number;
  };
}

export interface PhoneColor {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface PhoneColorResponse {
  status: number;
  message: string;
  data: PhoneColor[];
  errors: null;
}

export interface PhoneSpecification {
  id: number;
  name: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface PhoneSpecificationResponse {
  status: number;
  message: string;
  data: PhoneSpecification[];
  errors: null;
}

// Variant creation interfaces
export interface CreateVariantColor {
  colorId: number;
  imageUrl: string;
}

export interface CreateVariantSpecification {
  specId: number;
  info: string;
  unit?: string;
}

export interface CreateVariantData {
  variantName: string;
  description: string;
  colors: CreateVariantColor[];
  price: number;
  discountPercent?: number;
  images?: string[];
  specifications: CreateVariantSpecification[];
}

export interface CreateVariantRequest {
  phoneId: number;
  data: CreateVariantData;
}

export interface CreateVariantResponse {
  status: number;
  message: string;
  data: {
    phoneVariantId: number;
  };
  errors: null;
}

/**
 * Fetch phone list
 */
export const fetchPhoneList = async (): Promise<PhoneListResponse> => {
  const baseURL = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com'
    : 'http://localhost:3000';
  
  const url = `${baseURL}/api/v1/phones/list`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch phone list: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.warn('Phone API not available, using mock data:', error);
    // Return mock data
    return {
      status: 200,
      message: "Phones retrieved successfully",
      data: {
        data: [],
        paging: { page: 1, limit: 10, order: 'asc' },
        total: 0
      }
    };
  }
};

/**
 * Fetch phone colors
 */
export const fetchPhoneColors = async (): Promise<PhoneColorResponse> => {
  const baseURL = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com'
    : 'http://localhost:3000';
  
  const url = `${baseURL}/api/v1/phones/colors`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch phone colors: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.warn('Phone Colors API not available, using mock data:', error);
    return {
      status: 200,
      message: "Colors retrieved successfully",
      data: [],
      errors: null
    };
  }
};

/**
 * Fetch phone specifications
 */
export const fetchPhoneSpecifications = async (): Promise<PhoneSpecificationResponse> => {
  const baseURL = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com'
    : 'http://localhost:3000';
  
  const url = `${baseURL}/api/v1/phones/specifications`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch phone specifications: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.warn('Phone Specifications API not available, using mock data:', error);
    return {
      status: 200,
      message: "Specifications retrieved successfully",
      data: [],
      errors: null
    };
  }
};

/**
 * Create a new phone variant
 */
export const createPhoneVariant = async (requestData: CreateVariantRequest): Promise<CreateVariantResponse> => {
  const baseURL = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com'
    : 'http://localhost:3000';
  
  const url = `${baseURL}/api/v1/phones/variants/create`;
  
  // Get JWT token from localStorage (using phonehub_tokens key)
  let token = null;
  try {
    const tokens = localStorage.getItem('phonehub_tokens');
    if (tokens) {
      const tokenData = JSON.parse(tokens);
      token = tokenData.accessToken || tokenData.access_token || tokenData.token;
    }
  } catch (error) {
    console.error('Error parsing token data:', error);
  }
  
  // Check if token exists
  if (!token) {
    throw new Error('Authentication token not found. Please login again.');
  }
  
  // Log token information for debugging
  console.log('=== API REQUEST DEBUG ===');
  console.log('1. Request URL:', url);
  console.log('2. Request Method: POST');
  console.log('3. Token found:', token ? 'Yes' : 'No');
  console.log('4. Token preview:', token ? `${token.substring(0, 20)}...` : 'No token');
  console.log('5. Request Body:', JSON.stringify(requestData, null, 2));
  console.log('========================');
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      console.log('=== API ERROR RESPONSE ===');
      console.log('1. Response Status:', response.status);
      console.log('2. Response Status Text:', response.statusText);
      console.log('3. Response Headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid or expired token. Please login again.');
      } else if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to create phone variants.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('4. Error Response Body:', errorData);
        throw new Error(errorData.message || `Failed to create phone variant: ${response.status} ${response.statusText}`);
      }
    }

    const responseData = await response.json();
    console.log('=== API SUCCESS RESPONSE ===');
    console.log('1. Response Status:', response.status);
    console.log('2. Response Data:', responseData);
    console.log('============================');
    
    return responseData;
  } catch (error) {
    console.error('Error creating phone variant:', error);
    throw error;
  }
};
