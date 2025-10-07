import axiosInstance from "./axiosInstance";
import i18n from "i18next";

// Mock data fallback
const getMockData = (endPoint: string) => {
  const mockData: Record<string, any> = {
    "/bootstrap": {
      homeProductCarousel: [
        {
          id: 1,
          name: "Tai nghe không dây cao cấp",
          price: "199.99",
          image: "/images/slider/slide1.webp"
        },
        {
          id: 2,
          name: "Đồng hồ thông minh Series 5", 
          price: "299.99",
          image: "/images/slider/slide1.webp"
        },
        {
          id: 3,
          name: "Loa Bluetooth",
          price: "89.99",
          image: "/images/slider/slide1.webp"
        },
        {
          id: 4,
          name: "Chuột gaming",
          price: "79.99",
          image: "/images/slider/slide1.webp"
        }
      ]
    },
    "/lightbootstrap": {
      menuItems: [
        {
          id: 1,
          label: "Trang chủ",
          link: "/",
          children: []
        },
        {
          id: 2,
          label: "Điện tử",
          link: "/category/1",
          children: [
            { id: 21, label: "Điện thoại", link: "/category/21" },
            { id: 22, label: "Laptop", link: "/category/22" },
            { id: 23, label: "Phụ kiện", link: "/category/23" }
          ]
        },
        {
          id: 3,
          label: "Thời trang",
          link: "/category/2",
          children: [
            { id: 31, label: "Quần áo nam", link: "/category/31" },
            { id: 32, label: "Quần áo nữ", link: "/category/32" }
          ]
        }
      ]
    },
    "/productdetail": {
      id: 1,
      name: "Tai nghe không dây cao cấp",
      price: "199.99",
      originalPrice: "249.99",
      images: [
        "/images/slider/slide1.webp",
        "/images/slider/slide1.webp",
        "/images/slider/slide1.webp"
      ],
      description: "Tai nghe không dây chất lượng cao với công nghệ khử tiếng ồn và âm thanh cao cấp. Hoàn hảo cho những người yêu âm nhạc và chuyên nghiệp.",
      features: [
        "Khử tiếng ồn chủ động",
        "Pin 30 giờ",
        "Sạc nhanh",
        "Chất liệu cao cấp"
      ],
      variants: [
        { id: 1, name: "Đen", color: "#000000" },
        { id: 2, name: "Trắng", color: "#FFFFFF" },
        { id: 3, name: "Xanh", color: "#0066CC" }
      ]
    },
    "/cart": {
      products: [],
      total: 0,
      subtotal: 0,
      shipping: 0
    },
    "/categoryProducts": {
      product: [
        {
          id: 1,
          name: "Tai nghe không dây cao cấp",
          price: "199.99",
          image: "/images/slider/slide1.webp"
        },
        {
          id: 2,
          name: "Đồng hồ thông minh Series 5",
          price: "299.99",
          image: "/images/slider/slide1.webp"
        },
        {
          id: 3,
          name: "Loa Bluetooth",
          price: "89.99",
          image: "/images/slider/slide1.webp"
        },
        {
          id: 4,
          name: "Chuột gaming",
          price: "79.99",
          image: "/images/slider/slide1.webp"
        },
        {
          id: 5,
          name: "Bàn phím cơ",
          price: "149.99",
          image: "/images/slider/slide1.webp"
        },
        {
          id: 6,
          name: "Hub USB-C",
          price: "59.99",
          image: "/images/slider/slide1.webp"
        }
      ],
      totalProducts: 6,
      totalPage: 1,
      filters: [
        {
          name: "Giá",
          options: [
            { label: "Dưới 100$", value: "0-100" },
            { label: "100$ - 200$", value: "100-200" },
            { label: "Trên 200$", value: "200+" }
          ]
        },
        {
          name: "Thương hiệu",
          options: [
            { label: "Apple", value: "apple" },
            { label: "Samsung", value: "samsung" },
            { label: "Sony", value: "sony" }
          ]
        }
      ],
      sortOptions: [
        { label: "Giá: Thấp đến cao", value: "price_asc" },
        { label: "Giá: Cao đến thấp", value: "price_desc" },
        { label: "Tên A-Z", value: "name_asc" },
        { label: "Tên Z-A", value: "name_desc" }
      ]
    },
    "/featuredproducts": {
      products: [
        {
          id: 1,
          name: "Tai nghe không dây cao cấp",
          price: "199.99",
          image: "/images/slider/slide1.webp"
        },
        {
          id: 2,
          name: "Đồng hồ thông minh Series 5",
          price: "299.99",
          image: "/images/slider/slide1.webp"
        }
      ]
    },
    "/productSearch": {
      products: [
        {
          id: 1,
          name: "Tai nghe không dây cao cấp",
          price: "199.99",
          image: "/images/slider/slide1.webp"
        },
        {
          id: 2,
          name: "Đồng hồ thông minh Series 5",
          price: "299.99",
          image: "/images/slider/slide1.webp"
        }
      ]
    }
  };
  
  return mockData[endPoint] || {};
};

export async function getData(
  endPoint: string,
  queryParams?: any,
  extraParam?: string,
  body?: any
): Promise<any> {
  // Chỉ sử dụng mock data, không gọi API
  console.log(`Using mock data for endpoint: ${endPoint}`);
  return getMockData(endPoint);
}
