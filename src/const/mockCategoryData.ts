import { CategoryAPI } from "@/utils/type";
import { allBrandProducts, getAllProducts } from "./mockData";

// Mock category data for each brand
export const createMockCategoryData = (brand: string): CategoryAPI => {
  const products = allBrandProducts[brand as keyof typeof allBrandProducts] || [];
  
  return {
    psdata: {
      name: `${brand.charAt(0).toUpperCase() + brand.slice(1)} Products`,
      products: products,
      sort_orders: [
        {
          label: "Giá: Thấp đến Cao",
          querySort: "price_asc",
          isActive: false
        },
        {
          label: "Giá: Cao đến Thấp", 
          querySort: "price_desc",
          isActive: false
        },
        {
          label: "Tên: A đến Z",
          querySort: "name_asc",
          isActive: false
        },
        {
          label: "Tên: Z đến A",
          querySort: "name_desc", 
          isActive: false
        },
        {
          label: "Đánh giá: Cao nhất",
          querySort: "rating_desc",
          isActive: true
        }
      ],
      facets: [
        {
          label: "Giá",
          displayed: true,
          widgetType: "range",
          filters: [
            {
              label: "Dưới 5 triệu",
              active: false,
              displayed: true,
              magnitude: 0,
              nextEncodedFacets: "price_0_5000000",
              properties: { color: "" }
            },
            {
              label: "5 - 10 triệu",
              active: false,
              displayed: true,
              magnitude: 0,
              nextEncodedFacets: "price_5000000_10000000",
              properties: { color: "" }
            },
            {
              label: "10 - 20 triệu",
              active: false,
              displayed: true,
              magnitude: 0,
              nextEncodedFacets: "price_10000000_20000000",
              properties: { color: "" }
            },
            {
              label: "Trên 20 triệu",
              active: false,
              displayed: true,
              magnitude: 0,
              nextEncodedFacets: "price_20000000_99999999",
              properties: { color: "" }
            }
          ]
        },
        {
          label: "Màu sắc",
          displayed: true,
          widgetType: "color",
          filters: [
            {
              label: "Đen",
              active: false,
              displayed: true,
              magnitude: 0,
              nextEncodedFacets: "color_black",
              properties: { color: "#000000" }
            },
            {
              label: "Trắng",
              active: false,
              displayed: true,
              magnitude: 0,
              nextEncodedFacets: "color_white",
              properties: { color: "#FFFFFF" }
            },
            {
              label: "Vàng",
              active: false,
              displayed: true,
              magnitude: 0,
              nextEncodedFacets: "color_gold",
              properties: { color: "#FFD700" }
            },
            {
              label: "Xanh",
              active: false,
              displayed: true,
              magnitude: 0,
              nextEncodedFacets: "color_blue",
              properties: { color: "#0066CC" }
            }
          ]
        },
        {
          label: "Bộ nhớ",
          displayed: true,
          widgetType: "checkbox",
          filters: [
            {
              label: "128GB",
              active: false,
              displayed: true,
              magnitude: 0,
              nextEncodedFacets: "storage_128gb",
              properties: { color: "" }
            },
            {
              label: "256GB",
              active: false,
              displayed: true,
              magnitude: 0,
              nextEncodedFacets: "storage_256gb",
              properties: { color: "" }
            },
            {
              label: "512GB",
              active: false,
              displayed: true,
              magnitude: 0,
              nextEncodedFacets: "storage_512gb",
              properties: { color: "" }
            },
            {
              label: "1TB",
              active: false,
              displayed: true,
              magnitude: 0,
              nextEncodedFacets: "storage_1tb",
              properties: { color: "" }
            }
          ]
        }
      ],
      order_param: "order",
      q_param: "q",
      pagination: {
        pages_count: 1,
        total_items: products.length
      }
    }
  };
};

// Specific mock data for each brand
export const appleCategoryData = createMockCategoryData("apple");
export const samsungCategoryData = createMockCategoryData("samsung");
export const xiaomiCategoryData = createMockCategoryData("xiaomi");
export const oppoCategoryData = createMockCategoryData("oppo");
export const vivoCategoryData = createMockCategoryData("vivo");
export const huaweiCategoryData = createMockCategoryData("huawei");
export const oneplusCategoryData = createMockCategoryData("oneplus");
export const realmeCategoryData = createMockCategoryData("realme");

// All category data
export const allCategoryData = {
  apple: appleCategoryData,
  samsung: samsungCategoryData,
  xiaomi: xiaomiCategoryData,
  oppo: oppoCategoryData,
  vivo: vivoCategoryData,
  huawei: huaweiCategoryData,
  oneplus: oneplusCategoryData,
  realme: realmeCategoryData
};

// Featured products category data
export const featuredCategoryData: CategoryAPI = {
  psdata: {
    name: "Sản phẩm nổi bật",
    products: [
      ...require('./mockData').featuredProducts,
      ...require('./mockData').newProducts
    ],
    sort_orders: [
      {
        label: "Giá: Thấp đến Cao",
        querySort: "price_asc",
        isActive: false
      },
      {
        label: "Giá: Cao đến Thấp", 
        querySort: "price_desc",
        isActive: false
      },
      {
        label: "Tên: A đến Z",
        querySort: "name_asc",
        isActive: false
      },
      {
        label: "Tên: Z đến A",
        querySort: "name_desc", 
        isActive: false
      },
      {
        label: "Đánh giá: Cao nhất",
        querySort: "rating_desc",
        isActive: true
      }
    ],
    facets: [
      {
        label: "Giá",
        displayed: true,
        widgetType: "range",
        filters: [
          {
            label: "Dưới 10 triệu",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "price_0_10000000",
            properties: { color: "" }
          },
          {
            label: "10 - 20 triệu",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "price_10000000_20000000",
            properties: { color: "" }
          },
          {
            label: "20 - 30 triệu",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "price_20000000_30000000",
            properties: { color: "" }
          },
          {
            label: "Trên 30 triệu",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "price_30000000_99999999",
            properties: { color: "" }
          }
        ]
      },
      {
        label: "Trạng thái",
        displayed: true,
        widgetType: "checkbox",
        filters: [
          {
            label: "Có giảm giá",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "discount_available",
            properties: { color: "" }
          },
          {
            label: "Sản phẩm mới",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "new_product",
            properties: { color: "" }
          }
        ]
      }
    ],
    order_param: "order",
    q_param: "q",
    pagination: {
      pages_count: 1,
      total_items: 14
    }
  }
};

// All products category data
export const allProductsCategoryData: CategoryAPI = {
  psdata: {
    name: "Tất cả sản phẩm",
    products: getAllProducts(),
    sort_orders: [
      {
        label: "Giá: Thấp đến Cao",
        querySort: "price_asc",
        isActive: false
      },
      {
        label: "Giá: Cao đến Thấp", 
        querySort: "price_desc",
        isActive: false
      },
      {
        label: "Tên: A đến Z",
        querySort: "name_asc",
        isActive: false
      },
      {
        label: "Tên: Z đến A",
        querySort: "name_desc", 
        isActive: false
      },
      {
        label: "Đánh giá: Cao nhất",
        querySort: "rating_desc",
        isActive: true
      }
    ],
    facets: [
      {
        label: "Thương hiệu",
        displayed: true,
        widgetType: "checkbox",
        filters: [
          {
            label: "Apple",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "brand_apple",
            properties: { color: "" }
          },
          {
            label: "Samsung",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "brand_samsung",
            properties: { color: "" }
          },
          {
            label: "Xiaomi",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "brand_xiaomi",
            properties: { color: "" }
          },
          {
            label: "OPPO",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "brand_oppo",
            properties: { color: "" }
          },
          {
            label: "Vivo",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "brand_vivo",
            properties: { color: "" }
          },
          {
            label: "Huawei",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "brand_huawei",
            properties: { color: "" }
          },
          {
            label: "OnePlus",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "brand_oneplus",
            properties: { color: "" }
          },
          {
            label: "Realme",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "brand_realme",
            properties: { color: "" }
          }
        ]
      },
      {
        label: "Giá",
        displayed: true,
        widgetType: "range",
        filters: [
          {
            label: "Dưới 5 triệu",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "price_0_5000000",
            properties: { color: "" }
          },
          {
            label: "5 - 10 triệu",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "price_5000000_10000000",
            properties: { color: "" }
          },
          {
            label: "10 - 20 triệu",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "price_10000000_20000000",
            properties: { color: "" }
          },
          {
            label: "20 - 30 triệu",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "price_20000000_30000000",
            properties: { color: "" }
          },
          {
            label: "Trên 30 triệu",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "price_30000000_99999999",
            properties: { color: "" }
          }
        ]
      },
      {
        label: "Màu sắc",
        displayed: true,
        widgetType: "color",
        filters: [
          {
            label: "Đen",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "color_black",
            properties: { color: "#000000" }
          },
          {
            label: "Trắng",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "color_white",
            properties: { color: "#FFFFFF" }
          },
          {
            label: "Vàng",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "color_gold",
            properties: { color: "#FFD700" }
          },
          {
            label: "Xanh",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "color_blue",
            properties: { color: "#0066CC" }
          }
        ]
      },
      {
        label: "Bộ nhớ",
        displayed: true,
        widgetType: "checkbox",
        filters: [
          {
            label: "128GB",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "storage_128gb",
            properties: { color: "" }
          },
          {
            label: "256GB",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "storage_256gb",
            properties: { color: "" }
          },
          {
            label: "512GB",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "storage_512gb",
            properties: { color: "" }
          },
          {
            label: "1TB",
            active: false,
            displayed: true,
            magnitude: 0,
            nextEncodedFacets: "storage_1tb",
            properties: { color: "" }
          }
        ]
      }
    ],
    order_param: "order",
    q_param: "q",
    pagination: {
      pages_count: 1,
      total_items: getAllProducts().length
    }
  }
};

// Helper function to get category data by brand
export const getCategoryDataByBrand = (brand: string): CategoryAPI => {
  if (brand === 'featured') {
    return featuredCategoryData;
  }
  if (brand === 'all') {
    return allProductsCategoryData;
  }
  return allCategoryData[brand as keyof typeof allCategoryData] || createMockCategoryData(brand);
};
