export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  disconnect: string;
  quantity: string;
  rate: number;
  color?: string;
  colorId?: number | null;
}

export interface ProductOptions {
  id: string;
  title: string;
  type: string;
  items: {
    id: string;
    value: string;
    hex_value?: string;
  }[];
}

export interface ProductPageProps {
  initialProduct: ProductType;
  productId: string;
}

export interface GroupAttributes {
  attributes: Record<string, { name: string; html_color_code?: string }>;
}
export interface Group {
  attributes: GroupAttributes["attributes"];
  group_name: string;
  group_type: string;
}
export interface Groups {
  [key: string]: Group;
}

export interface ProductData {
  name: string;
  images: { src: string }[];
  default_image: { url: string };
  price: string;
  groups: Groups;
  options?: ProductOptions[];
  description: string;
  id_product: string;
  id_product_attribute: number;
}

export interface ProductAPI {
  psdata: ProductData;
}

export interface ProductType {
  title: string;
  images: { src: string }[];
  price: string;
  originalPrice?: string;
  options: ProductOptions[];
  description: string;
  shortDescription?: string;
  id: string;
  productAttributeId: number;
  specifications?: { label: string; value: string }[];
  reviews?: { name: string; rating: number; comment: string; date: string }[];
  averageRating?: number;
  brand?: string;
  category?: string;
}
