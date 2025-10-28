// Brand Image Type
export interface BrandImage {
  id: number;
  imageUrl: string;
}

// Brand Type
export interface Brand {
  id: number;
  name: string;
  image: BrandImage;
}

// Brands API Response
export interface BrandsResponse {
  status: number;
  message: string;
  data: Brand[];
  errors: null | string;
}

// Transformed Brand for UI (with link)
export interface TransformedBrand {
  id: number;
  name: string;
  imageUrl: string;
  link: string;
}

