import { PhoneVariant, PhoneVariantsResponse, PhoneVariantDetailResponse } from "@/utils/type/phoneVariant";
import { Product, ProductOptions } from "@/utils/type/product";
import { ProductType } from "@/utils/type";

export const PhoneVariantTransformer = (data: PhoneVariant): Product => {
  // Calculate final price with discount
  const originalPrice = data.price.price;
  const discountPercent = data.discount?.discountPercent || 0;
  const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
  
  // Combine category name + variant name
  const displayName = `${data.phone.name} ${data.variantName}`;
  
  // Calculate total stock quantity from inventories
  // Only count inventories that are not deleted (isDeleted: false)
  const totalStock = data.inventories?.reduce((sum, inventory) => {
    if (inventory.isDeleted) {
      console.log(`Skipping deleted inventory for variant ${data.id}:`, inventory.sku);
      return sum; // Skip deleted inventories
    }
    console.log(`Adding stock for variant ${data.id}:`, inventory.sku, inventory.stockQuantity);
    return sum + inventory.stockQuantity;
  }, 0) || 0;
  
  console.log(`Total stock for variant ${data.id} (${displayName}):`, totalStock);
  
  // Get primary color from colors array
  const primaryColor = data.colors && data.colors.length > 0 ? data.colors[0].color : null;
  
  return {
    id: data.id.toString(),
    name: displayName,
    price: finalPrice.toString(),
    image: data.images.length > 0 ? data.images[0].image.imageUrl : "/images/placeholder.png",
    disconnect: originalPrice.toString(), // Original price for discount calculation
    quantity: totalStock.toString(), // Total stock quantity from inventories
    rate: data.averageRating,
    color: primaryColor?.name || 'Không xác định',
    colorId: primaryColor?.id || null,
  };
};

export const PhoneVariantsResponseTransformer = (response: PhoneVariantsResponse) => {
  return {
    products: response.data.data.map(PhoneVariantTransformer),
    totalProducts: response.data.total,
    totalPages: Math.ceil(response.data.total / response.data.paging.limit),
    currentPage: response.data.paging.page,
    paging: response.data.paging,
  };
};

export const PhoneVariantDetailTransformer = (response: PhoneVariantDetailResponse): ProductType => {
  const variant = response.data;
  
  // Calculate final price with discount
  const originalPrice = variant.price.price;
  const discountPercent = variant.discount?.discountPercent || 0;
  const finalPrice = originalPrice - (originalPrice * discountPercent / 100);
  
  // Format prices to Vietnamese currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  
  // Create product title from phone name and variant name
  const title = `${variant.phone.name} ${variant.variantName}`;
  
  // Transform images - use actual image URLs from API
  const images = variant.images.map(img => ({
    id: img.id.toString(),
    src: img.image.imageUrl,
    alt: title,
  }));
  
  // Color mapping for hex values
  const colorHexMap: { [key: string]: string } = {
    'Đỏ': '#dc3545',
    'Xanh Dương': '#007bff', 
    'Xanh dương': '#007bff',
    'Xanh Lá': '#28a745',
    'Xanh lá': '#28a745',
    'Vàng': '#ffc107',
    'Đen': '#343a40',
    'Trắng': '#ffffff',
    'Hồng': '#e83e8c',
    'Tím': '#6f42c1',
    'Cam': '#fd7e14',
    'Nâu': '#795548',
    'Xám': '#6c757d',
    'Bạc': '#c0c0c0',
    'Vàng kim': '#ffd700'
  };

  // Transform color options to match ProductOptions structure
  const colorOptions: ProductOptions = {
    id: "colors",
    title: "Màu sắc",
    type: "color",
    items: variant.colors.map(color => ({
      id: color.color.id.toString(),
      value: color.color.name,
      hex_value: colorHexMap[color.color.name] || '#ccc', // Use mapped hex or default
    }))
  };
  
  // Transform specifications
  const specifications = variant.specifications.map(spec => ({
    label: spec.specification.name,
    value: spec.info,
  }));
  
  // Transform reviews
  const reviews = variant.reviews.map(review => ({
    name: `${review.customer?.user.username}`, // You might want to fetch user name from another API
    rating: review.rating,
    comment: review.comment,
    date: new Date(review.createdAt).toISOString().split('T')[0],
  }));
  
  return {
    id: variant.id.toString(),
    title,
    price: formatPrice(finalPrice),
    originalPrice: formatPrice(originalPrice),
    description: variant.description,
    shortDescription: variant.description.substring(0, 150) + "...",
    images,
    options: [colorOptions], // Array of ProductOptions
    specifications,
    reviews,
    averageRating: variant.averageRating,
    productAttributeId: variant.id,
    brand: variant.phone.brand.name,
    category: variant.phone.category.name,
  };
};
