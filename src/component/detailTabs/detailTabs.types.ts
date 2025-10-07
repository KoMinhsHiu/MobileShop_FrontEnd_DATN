export interface Specification {
  label: string;
  value: string;
}

export interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DetailTabsProps {
  description: string;
  specifications?: Specification[];
  reviews?: Review[];
}
