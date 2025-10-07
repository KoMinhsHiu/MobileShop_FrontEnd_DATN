import { HomeAPI } from "@/utils/type";

export const HomeTransformer = (data: any) => {
  // Handle both real API data and mock data
  let productsData;
  
  if (data?.psdata?.featuredProductsList) {
    // Real API data structure
    productsData = data.psdata.featuredProductsList;
  } else if (data?.homeProductCarousel) {
    // Mock data structure
    productsData = data.homeProductCarousel;
  } else {
    // Fallback empty array
    productsData = [];
  }

  const homeProductCarousel = productsData.map((product: any) => {
    return {
      id: product.id_product || product.id,
      name: product.name,
      price: product.price,
      image: product.cover?.url || product.image,
      disconnect: product.discount_amount || 0,
      quantity: product.quantity || 1,
      rate: product.rate || 0,
    };
  });

  return {
    homeProductCarousel,
  };
};
