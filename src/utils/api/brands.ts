import axiosInstance from "./fetchData/axiosInstance";
import { BrandsAPI } from "@/const/endPoint";
import { BrandsResponse, TransformedBrand } from "@/utils/type/brand";

/**
 * Fetch all brands from API
 * @returns Promise<TransformedBrand[]>
 */
export async function fetchBrands(): Promise<TransformedBrand[]> {
  try {
    const response = await axiosInstance.get<BrandsResponse>(BrandsAPI);

    if (response.data && response.data.data) {
      // Transform brands data to include link to products page with brand filter
      return response.data.data.map((brand) => ({
        id: brand.id,
        name: brand.name,
        imageUrl: brand.image.imageUrl,
        link: `/products?brand=${brand.name}`,
      }));
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    throw error;
  }
}

/**
 * Fetch brands with error handling that returns empty array on failure
 * @returns Promise<TransformedBrand[]>
 */
export async function fetchBrandsSafe(): Promise<TransformedBrand[]> {
  try {
    return await fetchBrands();
  } catch (error) {
    console.error("Error fetching brands (safe mode):", error);
    return [];
  }
}

