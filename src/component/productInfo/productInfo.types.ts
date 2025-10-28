import { ProductOptions } from "@/utils/type";

export interface Specification {
  label: string;
  value: string;
}

export interface productInfoProps {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  options: ProductOptions[];
  description: string;
  shortDescription?: string;
  specifications?: Specification[];
  productAttributeId: number;
  onDebugInfo?: (info: any) => void;
}
