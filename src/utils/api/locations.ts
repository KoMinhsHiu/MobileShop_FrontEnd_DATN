import axiosInstance from './fetchData/axiosInstance';
import { ProvincesAPI, CommunesAPI } from '@/const/endPoint';

// Types for API responses
export interface Province {
  id: number;
  code: number;
  name: string;
  divisionType: string;
  codename: string;
  phoneCode: number;
}

export interface Commune {
  id: number;
  code: number;
  name: string;
  divisionType: string;
  codename: string;
  provinceCode: number;
}

export interface ProvincesResponse {
  status: number;
  message: string;
  data: Province[];
}

export interface CommunesResponse {
  status: number;
  message: string;
  data: Commune[];
}

// API functions
export const locationsAPI = {
  // Get all provinces
  getProvinces: async (): Promise<ProvincesResponse> => {
    try {
      const response = await axiosInstance.get(ProvincesAPI);
      return response.data;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    }
  },

  // Get communes by province code
  getCommunesByProvince: async (provinceCode: number): Promise<CommunesResponse> => {
    try {
      const response = await axiosInstance.get(`${CommunesAPI}/${provinceCode}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching communes for province ${provinceCode}:`, error);
      throw error;
    }
  }
};
