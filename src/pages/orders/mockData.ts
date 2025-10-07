import { Order, OrderStatus } from "@/utils/type/order";

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "#12345678",
    orderDate: "2024-01-15T10:30:00Z",
    status: "delivered",
    paymentMethod: "cod",
    shippingInfo: {
      fullName: "Nguyễn Văn A",
      phone: "0123456789",
      province: "Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
      address: "123 Đường Nguyễn Huệ",
      note: "Giao hàng vào buổi chiều"
    },
    items: [
      {
        id: "1",
        name: "iPhone 15 Pro Max 256GB",
        image: "/images/products/iphone15.jpg",
        price: "29990000",
        quantity: 1,
        attributes: { key: "Titan Xanh" }
      }
    ],
    summary: {
      totalItems: 1,
      subtotal: 29990000,
      shippingFee: 0,
      grandTotal: 29990000
    }
  },
  {
    id: "2",
    orderNumber: "#12345679",
    orderDate: "2024-01-14T14:20:00Z",
    status: "shipping",
    paymentMethod: "momo",
    shippingInfo: {
      fullName: "Trần Thị B",
      phone: "0987654321",
      province: "Hà Nội",
      district: "Quận Cầu Giấy",
      ward: "Phường Dịch Vọng",
      address: "456 Đường Cầu Giấy",
      note: ""
    },
    items: [
      {
        id: "2",
        name: "Samsung Galaxy S24 Ultra 512GB",
        image: "/images/products/samsung-s24.jpg",
        price: "25990000",
        quantity: 1,
        attributes: { key: "Titan Đen" }
      },
      {
        id: "3",
        name: "AirPods Pro 2",
        image: "/images/products/airpods-pro.jpg",
        price: "5990000",
        quantity: 1,
        attributes: { key: "Trắng" }
      }
    ],
    summary: {
      totalItems: 2,
      subtotal: 31980000,
      shippingFee: 30000,
      grandTotal: 32010000
    }
  },
  {
    id: "3",
    orderNumber: "#12345680",
    orderDate: "2024-01-13T09:15:00Z",
    status: "pending",
    paymentMethod: "vnpay",
    shippingInfo: {
      fullName: "Lê Văn C",
      phone: "0369852147",
      province: "Đà Nẵng",
      district: "Quận Hải Châu",
      ward: "Phường Thạch Thang",
      address: "789 Đường Lê Duẩn",
      note: "Giao hàng nhanh"
    },
    items: [
      {
        id: "4",
        name: "Xiaomi 14 Pro 256GB",
        image: "/images/products/xiaomi-14.jpg",
        price: "19990000",
        quantity: 1,
        attributes: { key: "Đen" }
      }
    ],
    summary: {
      totalItems: 1,
      subtotal: 19990000,
      shippingFee: 30000,
      grandTotal: 20020000
    }
  }
];

// Order status configuration
export const orderStatusConfig: OrderStatus = {
  pending: {
    label: "Chờ xác nhận",
    color: "#f59e0b",
    icon: "⏳"
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "#3b82f6",
    icon: "✅"
  },
  shipping: {
    label: "Đang giao hàng",
    color: "#8b5cf6",
    icon: "🚚"
  },
  delivered: {
    label: "Đã giao hàng",
    color: "#10b981",
    icon: "📦"
  },
  cancelled: {
    label: "Đã hủy",
    color: "#ef4444",
    icon: "❌"
  }
};

// Timeline steps configuration
export const timelineSteps = [
  {
    key: "pending",
    label: "Đã đặt hàng",
    description: "Đơn hàng đã được đặt thành công",
    icon: "📝"
  },
  {
    key: "confirmed",
    label: "Đang xử lý",
    description: "Đơn hàng đang được xử lý",
    icon: "⚙️"
  },
  {
    key: "shipping",
    label: "Đang giao hàng",
    description: "Đơn hàng đang được vận chuyển",
    icon: "🚚"
  },
  {
    key: "delivered",
    label: "Hoàn thành",
    description: "Đơn hàng đã được giao thành công",
    icon: "✅"
  }
];
