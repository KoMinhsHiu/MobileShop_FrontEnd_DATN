import { Product, CategoryProducts } from "@/utils/type";

// Mock data for Apple products
export const appleProducts: CategoryProducts[] = [
  {
    id_product: "apple-001",
    name: "iPhone 15 Pro Max",
    price: "29.990.000",
    cover: {
      url: "/images/products/apple/iphone-15-pro-max.jpg"
    },
    discount_amount: 0,
    quantity: 50,
    rate: "4.8"
  },
  {
    id_product: "apple-002", 
    name: "iPhone 15 Pro",
    price: "26.990.000",
    cover: {
      url: "/images/products/apple/iphone-15-pro.jpg"
    },
    discount_amount: 0,
    quantity: 45,
    rate: "4.7"
  },
  {
    id_product: "apple-003",
    name: "iPhone 15",
    price: "22.990.000", 
    cover: {
      url: "/images/products/apple/iphone-15.jpg"
    },
    discount_amount: 0,
    quantity: 60,
    rate: "4.6"
  },
  {
    id_product: "apple-004",
    name: "iPhone 14 Pro Max",
    price: "25.990.000",
    cover: {
      url: "/images/products/apple/iphone-14-pro-max.jpg"
    },
    discount_amount: 2000000,
    quantity: 30,
    rate: "4.5"
  },
  {
    id_product: "apple-005",
    name: "iPhone 14",
    price: "19.990.000",
    cover: {
      url: "/images/products/apple/iphone-14.jpg"
    },
    discount_amount: 1000000,
    quantity: 40,
    rate: "4.4"
  },
  {
    id_product: "apple-006",
    name: "iPhone 13",
    price: "16.990.000",
    cover: {
      url: "/images/products/apple/iphone-13.jpg"
    },
    discount_amount: 2000000,
    quantity: 25,
    rate: "4.3"
  }
];

// Mock data for Samsung products
export const samsungProducts: CategoryProducts[] = [
  {
    id_product: "samsung-001",
    name: "Samsung Galaxy S24 Ultra",
    price: "28.990.000",
    cover: {
      url: "/images/products/samsung/galaxy-s24-ultra.jpg"
    },
    discount_amount: 0,
    quantity: 35,
    rate: "4.7"
  },
  {
    id_product: "samsung-002",
    name: "Samsung Galaxy S24+",
    price: "24.990.000",
    cover: {
      url: "/images/products/samsung/galaxy-s24-plus.jpg"
    },
    discount_amount: 0,
    quantity: 40,
    rate: "4.6"
  },
  {
    id_product: "samsung-003",
    name: "Samsung Galaxy S24",
    price: "20.990.000",
    cover: {
      url: "/images/products/samsung/galaxy-s24.jpg"
    },
    discount_amount: 0,
    quantity: 50,
    rate: "4.5"
  },
  {
    id_product: "samsung-004",
    name: "Samsung Galaxy Z Fold 5",
    price: "35.990.000",
    cover: {
      url: "/images/products/samsung/galaxy-z-fold-5.jpg"
    },
    discount_amount: 3000000,
    quantity: 15,
    rate: "4.4"
  },
  {
    id_product: "samsung-005",
    name: "Samsung Galaxy Z Flip 5",
    price: "19.990.000",
    cover: {
      url: "/images/products/samsung/galaxy-z-flip-5.jpg"
    },
    discount_amount: 2000000,
    quantity: 20,
    rate: "4.3"
  },
  {
    id_product: "samsung-006",
    name: "Samsung Galaxy A54",
    price: "8.990.000",
    cover: {
      url: "/images/products/samsung/galaxy-a54.jpg"
    },
    discount_amount: 1000000,
    quantity: 60,
    rate: "4.2"
  }
];

// Mock data for Xiaomi products
export const xiaomiProducts: CategoryProducts[] = [
  {
    id_product: "xiaomi-001",
    name: "Xiaomi 14 Ultra",
    price: "22.990.000",
    cover: {
      url: "/images/products/xiaomi/mi-14-ultra.jpg"
    },
    discount_amount: 0,
    quantity: 25,
    rate: "4.6"
  },
  {
    id_product: "xiaomi-002",
    name: "Xiaomi 14 Pro",
    price: "18.990.000",
    cover: {
      url: "/images/products/xiaomi/mi-14-pro.jpg"
    },
    discount_amount: 0,
    quantity: 30,
    rate: "4.5"
  },
  {
    id_product: "xiaomi-003",
    name: "Xiaomi 14",
    price: "15.990.000",
    cover: {
      url: "/images/products/xiaomi/mi-14.jpg"
    },
    discount_amount: 0,
    quantity: 40,
    rate: "4.4"
  },
  {
    id_product: "xiaomi-004",
    name: "Xiaomi 13T Pro",
    price: "12.990.000",
    cover: {
      url: "/images/products/xiaomi/mi-13t-pro.jpg"
    },
    discount_amount: 1000000,
    quantity: 35,
    rate: "4.3"
  },
  {
    id_product: "xiaomi-005",
    name: "Xiaomi Redmi Note 13 Pro",
    price: "6.990.000",
    cover: {
      url: "/images/products/xiaomi/redmi-note-13-pro.jpg"
    },
    discount_amount: 500000,
    quantity: 50,
    rate: "4.2"
  },
  {
    id_product: "xiaomi-006",
    name: "Xiaomi Redmi 13C",
    price: "3.990.000",
    cover: {
      url: "/images/products/xiaomi/redmi-13c.jpg"
    },
    discount_amount: 500000,
    quantity: 45,
    rate: "4.1"
  }
];

// Mock data for OPPO products
export const oppoProducts: CategoryProducts[] = [
  {
    id_product: "oppo-001",
    name: "OPPO Find X7 Ultra",
    price: "24.990.000",
    cover: {
      url: "/images/products/oppo/find-x7-ultra.jpg"
    },
    discount_amount: 0,
    quantity: 20,
    rate: "4.5"
  },
  {
    id_product: "oppo-002",
    name: "OPPO Find X7",
    price: "19.990.000",
    cover: {
      url: "/images/products/oppo/find-x7.jpg"
    },
    discount_amount: 0,
    quantity: 25,
    rate: "4.4"
  },
  {
    id_product: "oppo-003",
    name: "OPPO Reno 11 Pro",
    price: "12.990.000",
    cover: {
      url: "/images/products/oppo/reno-11-pro.jpg"
    },
    discount_amount: 1000000,
    quantity: 30,
    rate: "4.3"
  },
  {
    id_product: "oppo-004",
    name: "OPPO Reno 11",
    price: "9.990.000",
    cover: {
      url: "/images/products/oppo/reno-11.jpg"
    },
    discount_amount: 500000,
    quantity: 35,
    rate: "4.2"
  },
  {
    id_product: "oppo-005",
    name: "OPPO A98",
    price: "6.990.000",
    cover: {
      url: "/images/products/oppo/a98.jpg"
    },
    discount_amount: 500000,
    quantity: 40,
    rate: "4.1"
  },
  {
    id_product: "oppo-006",
    name: "OPPO A58",
    price: "4.990.000",
    cover: {
      url: "/images/products/oppo/a58.jpg"
    },
    discount_amount: 500000,
    quantity: 45,
    rate: "4.0"
  }
];

// Mock data for Vivo products
export const vivoProducts: CategoryProducts[] = [
  {
    id_product: "vivo-001",
    name: "Vivo X100 Pro",
    price: "21.990.000",
    cover: {
      url: "/images/products/vivo/x100-pro.jpg"
    },
    discount_amount: 0,
    quantity: 18,
    rate: "4.5"
  },
  {
    id_product: "vivo-002",
    name: "Vivo X100",
    price: "17.990.000",
    cover: {
      url: "/images/products/vivo/x100.jpg"
    },
    discount_amount: 0,
    quantity: 22,
    rate: "4.4"
  },
  {
    id_product: "vivo-003",
    name: "Vivo V30 Pro",
    price: "11.990.000",
    cover: {
      url: "/images/products/vivo/v30-pro.jpg"
    },
    discount_amount: 1000000,
    quantity: 28,
    rate: "4.3"
  },
  {
    id_product: "vivo-004",
    name: "Vivo V30",
    price: "8.990.000",
    cover: {
      url: "/images/products/vivo/v30.jpg"
    },
    discount_amount: 500000,
    quantity: 32,
    rate: "4.2"
  },
  {
    id_product: "vivo-005",
    name: "Vivo Y36",
    price: "5.990.000",
    cover: {
      url: "/images/products/vivo/y36.jpg"
    },
    discount_amount: 500000,
    quantity: 38,
    rate: "4.1"
  },
  {
    id_product: "vivo-006",
    name: "Vivo Y27",
    price: "4.490.000",
    cover: {
      url: "/images/products/vivo/y27.jpg"
    },
    discount_amount: 500000,
    quantity: 42,
    rate: "4.0"
  }
];

// Mock data for Huawei products
export const huaweiProducts: CategoryProducts[] = [
  {
    id_product: "huawei-001",
    name: "Huawei Mate 60 Pro",
    price: "23.990.000",
    cover: {
      url: "/images/products/huawei/mate-60-pro.jpg"
    },
    discount_amount: 0,
    quantity: 15,
    rate: "4.4"
  },
  {
    id_product: "huawei-002",
    name: "Huawei Mate 60",
    price: "19.990.000",
    cover: {
      url: "/images/products/huawei/mate-60.jpg"
    },
    discount_amount: 0,
    quantity: 18,
    rate: "4.3"
  },
  {
    id_product: "huawei-003",
    name: "Huawei P60 Pro",
    price: "16.990.000",
    cover: {
      url: "/images/products/huawei/p60-pro.jpg"
    },
    discount_amount: 2000000,
    quantity: 20,
    rate: "4.2"
  },
  {
    id_product: "huawei-004",
    name: "Huawei P60",
    price: "13.990.000",
    cover: {
      url: "/images/products/huawei/p60.jpg"
    },
    discount_amount: 1000000,
    quantity: 22,
    rate: "4.1"
  },
  {
    id_product: "huawei-005",
    name: "Huawei Nova 11",
    price: "8.990.000",
    cover: {
      url: "/images/products/huawei/nova-11.jpg"
    },
    discount_amount: 1000000,
    quantity: 25,
    rate: "4.0"
  },
  {
    id_product: "huawei-006",
    name: "Huawei Y9a",
    price: "5.990.000",
    cover: {
      url: "/images/products/huawei/y9a.jpg"
    },
    discount_amount: 500000,
    quantity: 30,
    rate: "3.9"
  }
];

// Mock data for OnePlus products
export const oneplusProducts: CategoryProducts[] = [
  {
    id_product: "oneplus-001",
    name: "OnePlus 12",
    price: "20.990.000",
    cover: {
      url: "/images/products/oneplus/oneplus-12.jpg"
    },
    discount_amount: 0,
    quantity: 12,
    rate: "4.6"
  },
  {
    id_product: "oneplus-002",
    name: "OnePlus 12R",
    price: "15.990.000",
    cover: {
      url: "/images/products/oneplus/oneplus-12r.jpg"
    },
    discount_amount: 0,
    quantity: 15,
    rate: "4.5"
  },
  {
    id_product: "oneplus-003",
    name: "OnePlus 11",
    price: "16.990.000",
    cover: {
      url: "/images/products/oneplus/oneplus-11.jpg"
    },
    discount_amount: 2000000,
    quantity: 18,
    rate: "4.4"
  },
  {
    id_product: "oneplus-004",
    name: "OnePlus 11R",
    price: "12.990.000",
    cover: {
      url: "/images/products/oneplus/oneplus-11r.jpg"
    },
    discount_amount: 1000000,
    quantity: 20,
    rate: "4.3"
  },
  {
    id_product: "oneplus-005",
    name: "OnePlus Nord 3",
    price: "8.990.000",
    cover: {
      url: "/images/products/oneplus/nord-3.jpg"
    },
    discount_amount: 1000000,
    quantity: 25,
    rate: "4.2"
  },
  {
    id_product: "oneplus-006",
    name: "OnePlus Nord CE 3",
    price: "6.990.000",
    cover: {
      url: "/images/products/oneplus/nord-ce-3.jpg"
    },
    discount_amount: 500000,
    quantity: 28,
    rate: "4.1"
  }
];

// Mock data for Realme products
export const realmeProducts: CategoryProducts[] = [
  {
    id_product: "realme-001",
    name: "Realme GT 5 Pro",
    price: "14.990.000",
    cover: {
      url: "/images/products/realme/gt-5-pro.jpg"
    },
    discount_amount: 0,
    quantity: 20,
    rate: "4.4"
  },
  {
    id_product: "realme-002",
    name: "Realme GT 5",
    price: "11.990.000",
    cover: {
      url: "/images/products/realme/gt-5.jpg"
    },
    discount_amount: 0,
    quantity: 25,
    rate: "4.3"
  },
  {
    id_product: "realme-003",
    name: "Realme 12 Pro+",
    price: "8.990.000",
    cover: {
      url: "/images/products/realme/12-pro-plus.jpg"
    },
    discount_amount: 1000000,
    quantity: 30,
    rate: "4.2"
  },
  {
    id_product: "realme-004",
    name: "Realme 12 Pro",
    price: "6.990.000",
    cover: {
      url: "/images/products/realme/12-pro.jpg"
    },
    discount_amount: 500000,
    quantity: 35,
    rate: "4.1"
  },
  {
    id_product: "realme-005",
    name: "Realme C67",
    price: "4.990.000",
    cover: {
      url: "/images/products/realme/c67.jpg"
    },
    discount_amount: 500000,
    quantity: 40,
    rate: "4.0"
  },
  {
    id_product: "realme-006",
    name: "Realme C55",
    price: "3.990.000",
    cover: {
      url: "/images/products/realme/c55.jpg"
    },
    discount_amount: 500000,
    quantity: 45,
    rate: "3.9"
  }
];

// Combined mock data for all brands
export const allBrandProducts = {
  apple: appleProducts,
  samsung: samsungProducts,
  xiaomi: xiaomiProducts,
  oppo: oppoProducts,
  vivo: vivoProducts,
  huawei: huaweiProducts,
  oneplus: oneplusProducts,
  realme: realmeProducts
};

// Helper function to get products by brand
export const getProductsByBrand = (brand: string): CategoryProducts[] => {
  return allBrandProducts[brand as keyof typeof allBrandProducts] || [];
};

// All products from all brands combined
export const getAllProducts = (): CategoryProducts[] => {
  return [
    ...appleProducts,
    ...samsungProducts,
    ...xiaomiProducts,
    ...oppoProducts,
    ...vivoProducts,
    ...huaweiProducts,
    ...oneplusProducts,
    ...realmeProducts
  ];
};

// Featured/New Products data
export const featuredProducts: CategoryProducts[] = [
  {
    id_product: "featured-001",
    name: "iPhone 15 Pro Max - Hot Deal",
    price: "29.990.000",
    cover: {
      url: "/images/products/featured/iphone-15-pro-max.jpg"
    },
    discount_amount: 3000000,
    quantity: 15,
    rate: "4.9"
  },
  {
    id_product: "featured-002",
    name: "Samsung Galaxy S24 Ultra - New",
    price: "28.990.000",
    cover: {
      url: "/images/products/featured/galaxy-s24-ultra.jpg"
    },
    discount_amount: 0,
    quantity: 25,
    rate: "4.8"
  },
  {
    id_product: "featured-003",
    name: "Xiaomi 14 Ultra - Best Seller",
    price: "22.990.000",
    cover: {
      url: "/images/products/featured/mi-14-ultra.jpg"
    },
    discount_amount: 2000000,
    quantity: 30,
    rate: "4.7"
  },
  {
    id_product: "featured-004",
    name: "OPPO Find X7 Ultra - Limited",
    price: "24.990.000",
    cover: {
      url: "/images/products/featured/find-x7-ultra.jpg"
    },
    discount_amount: 1500000,
    quantity: 10,
    rate: "4.6"
  },
  {
    id_product: "featured-005",
    name: "Vivo X100 Pro - Trending",
    price: "21.990.000",
    cover: {
      url: "/images/products/featured/x100-pro.jpg"
    },
    discount_amount: 1000000,
    quantity: 20,
    rate: "4.5"
  },
  {
    id_product: "featured-006",
    name: "OnePlus 12 - Flash Sale",
    price: "20.990.000",
    cover: {
      url: "/images/products/featured/oneplus-12.jpg"
    },
    discount_amount: 2500000,
    quantity: 12,
    rate: "4.8"
  },
  {
    id_product: "featured-007",
    name: "Huawei Mate 60 Pro - Premium",
    price: "23.990.000",
    cover: {
      url: "/images/products/featured/mate-60-pro.jpg"
    },
    discount_amount: 0,
    quantity: 8,
    rate: "4.4"
  },
  {
    id_product: "featured-008",
    name: "Realme GT 5 Pro - Value",
    price: "14.990.000",
    cover: {
      url: "/images/products/featured/gt-5-pro.jpg"
    },
    discount_amount: 1000000,
    quantity: 35,
    rate: "4.3"
  }
];

// New Products data
export const newProducts: CategoryProducts[] = [
  {
    id_product: "new-001",
    name: "iPhone 15 Pro - Latest",
    price: "26.990.000",
    cover: {
      url: "/images/products/new/iphone-15-pro.jpg"
    },
    discount_amount: 0,
    quantity: 40,
    rate: "4.8"
  },
  {
    id_product: "new-002",
    name: "Samsung Galaxy S24+ - Just Released",
    price: "24.990.000",
    cover: {
      url: "/images/products/new/galaxy-s24-plus.jpg"
    },
    discount_amount: 0,
    quantity: 35,
    rate: "4.7"
  },
  {
    id_product: "new-003",
    name: "Xiaomi 14 Pro - Fresh",
    price: "18.990.000",
    cover: {
      url: "/images/products/new/mi-14-pro.jpg"
    },
    discount_amount: 0,
    quantity: 28,
    rate: "4.6"
  },
  {
    id_product: "new-004",
    name: "OPPO Find X7 - Brand New",
    price: "19.990.000",
    cover: {
      url: "/images/products/new/find-x7.jpg"
    },
    discount_amount: 0,
    quantity: 22,
    rate: "4.5"
  },
  {
    id_product: "new-005",
    name: "Vivo X100 - Latest Model",
    price: "17.990.000",
    cover: {
      url: "/images/products/new/x100.jpg"
    },
    discount_amount: 0,
    quantity: 25,
    rate: "4.4"
  },
  {
    id_product: "new-006",
    name: "OnePlus 12R - New Arrival",
    price: "15.990.000",
    cover: {
      url: "/images/products/new/oneplus-12r.jpg"
    },
    discount_amount: 0,
    quantity: 18,
    rate: "4.5"
  }
];
