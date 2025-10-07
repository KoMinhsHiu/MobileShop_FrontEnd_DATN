import { FeaturedProductAPI } from "@/utils/type";

export const FeaturedProductTransformer = (data: any) => {
  // Handle both real API data and mock data
  let productsData;
  
  if (data?.psdata) {
    // Real API data structure
    productsData = data.psdata;
  } else if (data?.products) {
    // Mock data structure
    productsData = data.products;
  } else {
    // Fallback empty array
    productsData = [];
  }

  const productCarousel = productsData.map((product: any) => {
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
  return productCarousel;
};
