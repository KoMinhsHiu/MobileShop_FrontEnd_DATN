import { Filter, Sort } from "@/utils/type";

export type CategoryOptionsProps = {
  filters: Filter[];
  sortOptions: Sort[];
  count: number;
  setFilterQuery: (value: string) => void;
  setOrderQuery: (value: string) => void;
  onAdvancedFiltersChange?: (filters: {
    minPrice?: number;
    maxPrice?: number;
    chipset?: string;
    os?: string;
    minRam?: number;
    maxRam?: number;
    minStorage?: number;
    maxStorage?: number;
    minScreenSize?: number;
    maxScreenSize?: number;
    nfc?: boolean;
  }) => void;
};
