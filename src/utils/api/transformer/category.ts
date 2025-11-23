import {
  Category,
  CategoryAPI,
  CategoryFilter,
  CategoryProducts,
  CategorySort,
} from "@/utils/type";
import { getCategoryDataByBrand } from "@/const/mockCategoryData";

export const productTransformer = (data: CategoryProducts[]) => {
  const product = data.map((product) => {
    return {
      id: product.id_product,
      name: product.name,
      price: product.price,
      image: product.cover.url,
      disconnect: product.discount_amount,
      quantity: product.quantity,
      rate: product.rate,
    };
  });
  return product;
};

export const sortTransformer = (data: CategorySort[]) => {
  console.log('Sort transformer input:', data);
  const sortOptions = data.map((item: any) => {
    const result = {
      label: item.label,
      querySort: item.querySort || item.urlParameter,
      isActive: item.isActive || item.current,
    };
    console.log('Sort option result:', result);
    return result;
  });
  console.log('Sort transformer output:', sortOptions);
  return sortOptions;
};

export const filtersTransformer = (data: CategoryFilter[]) => {
  const filterOptions = data.map((item) => {
    return {
      label: item.label,
      display: item.displayed,
      type: item.widgetType,
      options: item.filters.map((item) => {
        return {
          label: item.label,
          active: item.active,
          display: item.displayed,
          productCount: item.magnitude,
          filterQuery: item.nextEncodedFacets,
          properties: item.properties,
        };
      }),
    };
  });
  return filterOptions;
};

export const CategoryTransformer = (data: any, categoryId?: string): Category => {
  // Handle both real API data and mock data
  if (data?.psdata) {
    // Real API data structure
    return {
      title: data.psdata.name,
      product: productTransformer(data.psdata.products),
      filters: filtersTransformer(data.psdata.facets),
      sortOptions: sortTransformer(data.psdata.sort_orders),
      activeSort: data.psdata.order_param ?? "",
      activeFilter: data.psdata.q_param ?? "",
      totalPage: data.psdata.pagination.pages_count,
      totalProducts: data.psdata.pagination.total_items,
    };
  } else if (categoryId && isBrandCategory(categoryId)) {
    // Use mock data for brand categories
    const mockData = getCategoryDataByBrand(categoryId);
    return {
      title: mockData.psdata.name,
      product: productTransformer(mockData.psdata.products),
      filters: filtersTransformer(mockData.psdata.facets),
      sortOptions: sortTransformer(mockData.psdata.sort_orders),
      activeSort: mockData.psdata.order_param ?? "",
      activeFilter: mockData.psdata.q_param ?? "",
      totalPage: mockData.psdata.pagination.pages_count,
      totalProducts: mockData.psdata.pagination.total_items,
    };
  } else {
    // Fallback mock data structure
    return {
      title: data.title || "Category",
      product: data.product?.map((product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        disconnect: 0,
        quantity: 1,
        rate: 0,
      })) || [],
      filters: data.filters?.map((filter: any) => ({
        label: filter.name,
        display: true,
        type: "checkbox",
        options: filter.options?.map((option: any) => ({
          label: option.label,
          active: false,
          display: true,
          productCount: 0,
          filterQuery: option.value,
          properties: {},
        })) || [],
      })) || [],
      sortOptions: data.sortOptions?.map((option: any) => ({
        label: option.label,
        querySort: option.value,
        isActive: false,
      })) || [],
      activeSort: "",
      activeFilter: "",
      totalPage: data.totalPage || 1,
      totalProducts: data.totalProducts || 0,
    };
  }
};

// Helper function to check if categoryId is a brand category or featured
const isBrandCategory = (categoryId: string): boolean => {
  const brandCategories = ['apple', 'samsung', 'xiaomi', 'oppo', 'vivo', 'huawei', 'oneplus', 'realme', 'featured', 'all'];
  return brandCategories.includes(categoryId.toLowerCase());
};
