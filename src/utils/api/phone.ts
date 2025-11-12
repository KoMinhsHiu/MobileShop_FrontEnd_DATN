import { BrandsAPI, CategoriesAPI, PhonesAPI } from "@/const/endPoint";
import { PhoneVariant } from "../type";
import axiosInstance from "./fetchData/axiosInstance";

// Phone API interfaces and functions
export interface PhoneBrand {
  id: number;
  name: string;
  image: {
    id: number;
    imageUrl: string;
  };
}

export interface CreateBrandRequest {
  name: string;
  imageUrl: string;
}

export interface UpdateBrandRequest {
  name?: string;
  imageUrl?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  parentId?: number | null;
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
  variants: Omit<PhoneVariant, 'phone'>[];
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

export interface FetchPhoneDetailResponse {
  status: number;
  message: string;
  data: Phone;
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

export interface UpdateVariantColor {
  colorId: number;
  newColorId?: number;
  imageUrl?: string;
  isDeleted?: boolean;
}

export interface UpdateVariantImage {
  id?: number;
  imageUrl: string;
  isDeleted?: boolean;
}

export interface CreateVariantSpecification {
  specId: number;
  info: string;
  unit?: string;
}

export interface UpdateVariantSpecification {
  specId: number;
  newSpecId?: number;
  info: string;
  unit?: string;
  isDeleted?: boolean;
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

export interface CreatePhoneRequest {
  name: string;
  brandId: number;
  categoryId: number;
  variants: CreateVariantData[];
}

export interface UpdatePhoneRequest {
  name?: string;
  brandId?: number;
  categoryId?: number;
}

export interface CreateVariantRequest {
  phoneId: number;
  data: CreateVariantData;
}

export interface UpdateVariantRequest {
  variantName?: string;
  description?: string;
  colors?: UpdateVariantColor[];
  price?: number;
  discount?: number;
  images?: UpdateVariantImage[];
  specifications?: UpdateVariantSpecification[];
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
 * Fetch phone list with pagination
 */
export const fetchPhoneList = async (page: number, limit: number): Promise<PhoneListResponse> => {
  const baseURL = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com'
    : 'http://localhost:3000';
  
  const url = `${baseURL}/api/v1/phones/list?page=${page}&limit=${limit}`;
  
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
        paging: { page, limit, order: 'asc' },
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

export const phonesAPI = {
  createBrand: async (requestData: CreateBrandRequest): Promise<void> => {
    try {
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

      await axiosInstance.post(`${BrandsAPI}/create`, 
        { name: requestData.name, imageUrl: requestData.imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error creating brand:', error);
      throw new Error(error.response?.data?.message || 'Failed to create brand');
    }
  },

  updateBrand: async (brandId: number, requestData: UpdateBrandRequest): Promise<void> => {
    try {
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

      await axiosInstance.put(`${BrandsAPI}/update/${brandId}`, 
        { ...requestData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error updating brand:', error);
      throw new Error(error.response?.data?.message || 'Failed to update brand');
    }
  },

  deleteBrand: async (brandId: number): Promise<void> => {
    try {
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

      await axiosInstance.put(`${BrandsAPI}/delete/${brandId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error deleting brand:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete brand');
    }
  },

  getPhoneById: async (phoneId: number): Promise<FetchPhoneDetailResponse> => {
    try {
      const response = await axiosInstance.get(`${PhonesAPI}/${phoneId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching phone details:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch phone details');
    }
  },

  createPhone: async (requestData: CreatePhoneRequest): Promise<void> => {
    try {
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

      await axiosInstance.post(`${PhonesAPI}/create`,
        { ...requestData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error creating phone:', error);
      throw new Error(error.response?.data?.message || 'Failed to create phone');
    }
  },

  updatePhone: async (phoneId: number, requestData: UpdatePhoneRequest): Promise<void> => {
    try {
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

      await axiosInstance.put(`${PhonesAPI}/update/${phoneId}`,
        { ...requestData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error updating phone:', error);
      throw new Error(error.response?.data?.message || 'Failed to update phone');
    }
  },

  deletePhone: async (phoneId: number): Promise<void> => {
    try {
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

      await axiosInstance.put(`${PhonesAPI}/delete/${phoneId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error deleting phone:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete phone');
    }
  },

  getAllCategories: async (): Promise<PhoneCategory[]> => {
    try {
      const response = await axiosInstance.get(`${CategoriesAPI}`);

      // Normalize response to an array in case the API wraps the list in a data property
      const payload = response.data ?? response;
      let items: any[] = [];

      if (Array.isArray(payload)) {
        items = payload;
      } else if (Array.isArray(payload.data)) {
        items = payload.data;
      } else if (Array.isArray(payload.data?.data)) {
        items = payload.data.data;
      } else {
        items = [];
      }

      // Flatten nested categories (children) into a flat list of { id, name, parentId }
      const flattened: { id: number; name: string; parentId: number | null }[] = [];

      const traverse = (node: any, parentId: number | null) => {
        if (!node || typeof node.id === 'undefined') return;
        const id = node.id;
        const name = typeof node.name === 'string' ? node.name.trim() : node.name;
        flattened.push({ id, name, parentId });
        const children = node.children;
        if (Array.isArray(children) && children.length > 0) {
          children.forEach((child: any) => traverse(child, id));
        }
      };

      items.forEach((root: any) => traverse(root, root.parentId ?? null));

      // Map to PhoneCategory. The original PhoneCategory.parentId is typed as number;
      // roots in the API may have parentId = null. Cast to satisfy the declared type.
      const categories = flattened.map((c) => ({
        id: c.id,
        name: c.name,
        parentId: (c.parentId === null ? null : c.parentId) as any,
      })) as unknown as PhoneCategory[];

      return categories;
    } catch (error: any) {
      console.error('Error fetching phone categories:', error);
      throw new Error(error.response?.message || 'Failed to fetch phone categories');
    }
  },

  createCategory: async (name: string, parentId?: number): Promise<void> => {
    try {
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

      await axiosInstance.post(`${CategoriesAPI}/create`, 
        { name, parentId: parentId || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error creating phone category:', error);
      throw new Error(error.response?.message || 'Failed to create phone category');
    }
  },

  updateCategory: async (categoryId: number, updateData: UpdateCategoryRequest): Promise<void> => {
    try {
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

      await axiosInstance.put(`${CategoriesAPI}/update/${categoryId}`, 
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error updating phone category:', error);
      throw new Error(error.response?.message || 'Failed to update phone category');
    }
  },

  deleteCategory: async (categoryId: number): Promise<void> => {
    try {
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

      await axiosInstance.put(`${CategoriesAPI}/delete/${categoryId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error deleting category:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  },

  getAllColors: async (): Promise<PhoneColor[]> => {
    try {
      const response = await axiosInstance.get(`${PhonesAPI}/colors`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching phone colors:', error);
      throw new Error(error.data?.response?.message || 'Failed to fetch phone colors');
    }
  },

  createColor: async (name: string): Promise<void> => {
    try {
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

      await axiosInstance.post(`${PhonesAPI}/colors/create`, 
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error creating phone color:', error);
      throw new Error(error.response?.message || 'Failed to create phone color');
    }
  },

  getAllSpecifications: async (): Promise<PhoneSpecification[]> => {
    try {
      const response = await axiosInstance.get(`${PhonesAPI}/specifications`);

      const specs: PhoneSpecification[] = response.data.data.map((spec: any) => ({
        id: spec.id,
        name: spec.name,
        unit: '',
        createdAt: spec.createdAt,
        updatedAt: spec.updatedAt,
        isDeleted: spec.isDeleted,
      }));

      return specs;
    } catch (error: any) {
      console.error('Error fetching phone specifications:', error);
      throw new Error(error.data?.response?.message || 'Failed to fetch phone specifications');
    }
  },

  createSpecification: async (name: string): Promise<void> => {
    try {
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

      await axiosInstance.post(`${PhonesAPI}/specifications/create`, 
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error creating phone specification:', error);
      throw new Error(error.response?.message || 'Failed to create phone specification');
    }
  },

  createPhoneVariant: async (requestData: CreateVariantRequest): Promise<void> => {
    try {
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

      await axiosInstance.post(`${PhonesAPI}/variants/create`,
        { ...requestData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error creating phone variant:', error);
      throw new Error(error.response?.message || 'Failed to create phone variant');
    }
  },

  updatePhoneVariant: async (variantId: number, requestData: UpdateVariantRequest): Promise<void> => {
    try {
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

      await axiosInstance.put(`${PhonesAPI}/variants/update/${variantId}`,
        { ...requestData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error updating phone variant:', error);
      throw new Error(error.response?.message || 'Failed to update phone variant');
    }
  },

  deletePhoneVariant: async (variantId: number): Promise<void> => {
    try {
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

      await axiosInstance.put(`${PhonesAPI}/variants/delete/${variantId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error: any) {
      console.error('Error deleting phone variant:', error);
      throw new Error(error.response?.message || 'Failed to delete phone variant');
    }
  }
}

export default phonesAPI;
