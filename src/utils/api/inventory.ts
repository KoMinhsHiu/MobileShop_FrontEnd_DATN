import { InventoriesAPI } from "@/const/endPoint";
import axiosInstance from "./fetchData/axiosInstance";

export interface UpsertInventoryRequest {
  variantId: number;
  colorId: number;
  sku: string;
  stockQuantity: number;
}

export const inventoryAPI = {
  upsertInventory: async (data: UpsertInventoryRequest): Promise<void> => {
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

      await axiosInstance.post(`${InventoriesAPI}/upsert`,
        data,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
    } catch (error: any) {
      console.error('Error upserting inventory:', error);
      throw new Error(error.response?.data?.message || 'Failed to upsert inventory');
    }
  }
}

export default inventoryAPI;