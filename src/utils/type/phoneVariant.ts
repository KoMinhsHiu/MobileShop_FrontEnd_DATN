// Types for Phone Variant API

export interface Brand {
  id: number;
  name: string;
  image: {
    id: number;
    imageUrl: string;
  };
}

export interface Category {
  id: number;
  name: string;
  parentId?: number;
}

export interface Phone {
  id: number;
  name: string;
  brand: Brand;
  category: Category;
}

export interface Color {
  id: number;
  name: string;
}

export interface ColorVariant {
  variantId: number;
  imageId: number;
  color: Color;
}

export interface Price {
  id: number;
  variantId: number;
  price: number;
  startDate: string;
  endDate: string | null;
}

export interface Discount {
  id: number;
  variantId: number;
  discountPercent: number;
  startDate: string;
  endDate: string | null;
}

export interface Image {
  id: number;
  imageUrl: string;
}

export interface ImageVariant {
  id: number;
  variantId: number;
  image: Image;
}

export interface Specification {
  name: string;
}

export interface SpecificationInfo {
  info: string;
  specification: Specification;
}

export interface Review {
  id: number;
  userId: number;
  variantId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  id: number;
  variantId: number;
  colorId: number;
  sku: string;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface PhoneVariant {
  id: number;
  variantName: string;
  description: string;
  phone: Phone;
  colors: ColorVariant[];
  price: Price;
  discount: Discount | null;
  images: ImageVariant[];
  specifications: SpecificationInfo[];
  reviews: Review[];
  averageRating: number;
  inventories: Inventory[];
}

export interface PhoneVariantDetailResponse {
  status: number;
  message: string;
  data: PhoneVariant;
}

// Types for Phone Variants List API
export interface PhoneVariantsData {
  data: PhoneVariant[];
  total: number;
  paging: {
    page: number;
    limit: number;
    order: string;
  };
}

export interface PhoneVariantsResponse {
  status: number;
  message: string;
  data: PhoneVariantsData;
}

export interface PhoneVariantsParams {
  page?: number;
  limit?: number;
  order?: "asc" | "desc";
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  chipset?: string | string[];
  os?: string | string[];
  minRam?: number;
  maxRam?: number;
  minStorage?: number;
  maxStorage?: number;
  minScreenSize?: number;
  maxScreenSize?: number;
  nfc?: boolean;
  sort?: string;
}