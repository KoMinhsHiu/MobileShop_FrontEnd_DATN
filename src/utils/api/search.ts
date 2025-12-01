import { SearchAPIEndpoint } from "@/const/endPoint";
import axiosInstance from "./fetchData/axiosInstance";

export interface PhoneData {
  id: number;
  name: string;
  imageUrl: string;
  originalPrice: number;
  discountPercent: number;
}

export interface SearchResponse {
  status: string;
  message: string;
  data: {
    phones: PhoneData[];
    categories: string[];
  };
  errors: null;
}


export const searchAPI = {
  searchPhones: async (query: string): Promise<SearchResponse> => {
    try {
      const response = await axiosInstance.get(`${SearchAPIEndpoint}`, {
        params: { q: query }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error searching phones:', error);
      throw new Error(error.response?.message || 'Failed to search phones');
    }
  } 
};

export default searchAPI;
