import { 
  faTachometerAlt,
  faBox,
  faShoppingCart,
  faUsers,
  faChartBar,
  faDollarSign,
  faArrowUp,
  faClock,
  faTruck,
  faCheckCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { 
  MenuItem, 
  DashboardSummaryCard, 
  RevenueData, 
  OrderStatusData, 
  RecentOrder, 
  Order, 
  OrderStatusOption
} from './admin.types';

export const MENU_ITEMS: MenuItem[] = [
  { icon: faTachometerAlt, label: 'Dashboard', href: '/admin', active: false },
  { icon: faBox, label: 'Quản lý sản phẩm', href: '/admin/products', active: false },
  { icon: faShoppingCart, label: 'Quản lý đơn hàng', href: '/admin/orders', active: false },
  { icon: faUsers, label: 'Quản lý khách hàng', href: '/admin/customers', active: false },
  { icon: faChartBar, label: 'Thống kê doanh thu', href: '/admin/reports', active: false },
];

export const SUMMARY_DATA: DashboardSummaryCard[] = [
  {
    title: 'Tổng sản phẩm hiện có',
    value: '1,247',
    unit: 'sản phẩm',
    change: '+12.5%',
    changeType: 'increase',
    icon: faBox,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    title: 'Đơn hàng hôm nay',
    value: '89',
    unit: 'đơn',
    change: '+8.3%',
    changeType: 'increase',
    icon: faShoppingCart,
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    title: 'Doanh thu tháng này',
    value: '2,450,000,000',
    unit: 'VNĐ',
    change: '+15.7%',
    changeType: 'increase',
    icon: faDollarSign,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    title: 'Tổng số khách hàng',
    value: '3,892',
    unit: 'người',
    change: '+5.2%',
    changeType: 'increase',
    icon: faUsers,
    color: '#f59e0b',
    bgColor: '#fef3c7'
  }
];

export const REVENUE_DATA: RevenueData[] = [
  { month: 'Th1', revenue: 1800000000, orders: 245 },
  { month: 'Th2', revenue: 2100000000, orders: 289 },
  { month: 'Th3', revenue: 1950000000, orders: 267 },
  { month: 'Th4', revenue: 2300000000, orders: 312 },
  { month: 'Th5', revenue: 2750000000, orders: 356 },
  { month: 'Th6', revenue: 2450000000, orders: 298 },
  { month: 'Th7', revenue: 2800000000, orders: 378 }
];

export const ORDER_STATUS_DATA: OrderStatusData[] = [
  { name: 'Chờ xác nhận', value: 18, color: '#f59e0b', count: 67 },
  { name: 'Đang giao', value: 35, color: '#3b82f6', count: 130 },
  { name: 'Hoàn tất', value: 42, color: '#10b981', count: 156 },
  { name: 'Hủy', value: 5, color: '#ef4444', count: 19 }
];

export const RECENT_ORDERS: RecentOrder[] = [
  { 
    id: '#AD001', 
    customer: 'Nguyễn Văn An', 
    amount: '2,450,000', 
    status: 'pending', 
    date: '2024-01-15 14:30',
    items: 2
  },
  { 
    id: '#AD002', 
    customer: 'Trần Thị Bình', 
    amount: '1,890,000', 
    status: 'shipping', 
    date: '2024-01-15 13:15',
    items: 1
  },
  { 
    id: '#AD003', 
    customer: 'Lê Văn Cường', 
    amount: '3,200,000', 
    status: 'completed', 
    date: '2024-01-15 11:45',
    items: 3
  },
  { 
    id: '#AD004', 
    customer: 'Phạm Thị Dung', 
    amount: '850,000', 
    status: 'cancelled', 
    date: '2024-01-15 10:20',
    items: 1
  },
  { 
    id: '#AD005', 
    customer: 'Hoàng Văn Em', 
    amount: '4,100,000', 
    status: 'completed', 
    date: '2024-01-15 09:30',
    items: 2
  }
];

export const NOTIFICATIONS = [
  { id: 1, message: 'Đơn hàng mới #001 cần xác nhận', time: '5 phút trước', type: 'order' as const },
  { id: 2, message: 'Sản phẩm iPhone 15 sắp hết hàng', time: '1 giờ trước', type: 'inventory' as const },
  { id: 3, message: 'Khách hàng mới đăng ký', time: '2 giờ trước', type: 'user' as const },
];

// Order Management Constants
export const ORDER_STATUS_OPTIONS: OrderStatusOption[] = [
  { 
    value: 'pending', 
    label: 'Chờ xác nhận', 
    color: '#f59e0b', 
    icon: '🟡' 
  },
  { 
    value: 'shipping', 
    label: 'Đang giao', 
    color: '#3b82f6', 
    icon: '🚚' 
  },
  { 
    value: 'completed', 
    label: 'Đã giao', 
    color: '#10b981', 
    icon: '✅' 
  },
  { 
    value: 'cancelled', 
    label: 'Đã hủy', 
    color: '#ef4444', 
    icon: '❌' 
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: '#DH001',
    customer: {
      id: '1',
      name: 'Nguyễn Văn An',
      phone: '0901234567',
      email: 'nguyenvanan@gmail.com',
      address: '123 Đường ABC',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé'
    },
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'iPhone 15',
        variant: '128GB - Đen',
        quantity: 1,
        unitPrice: 24000000,
        totalPrice: 24000000,
        image: '/images/products/iphone15.jpg'
      }
    ],
    totalAmount: 24000000,
    paymentMethod: 'VNPay',
    status: 'pending',
    orderDate: '2025-01-15 14:30:00',
    notes: 'Giao hàng trong giờ hành chính',
    internalNotes: 'Khách hàng VIP',
    createdAt: '2025-01-15T14:30:00Z',
    updatedAt: '2025-01-15T14:30:00Z'
  },
  {
    id: '2',
    orderNumber: '#DH002',
    customer: {
      id: '2',
      name: 'Trần Thị Bình',
      phone: '0907654321',
      email: 'tranthibinh@gmail.com',
      address: '456 Đường XYZ',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận 3',
      ward: 'Phường Võ Thị Sáu'
    },
    items: [
      {
        id: '2',
        productId: '2',
        productName: 'Samsung Galaxy S24',
        variant: '256GB - Xanh',
        quantity: 1,
        unitPrice: 18900000,
        totalPrice: 18900000,
        image: '/images/products/samsung-s24.jpg'
      }
    ],
    totalAmount: 18900000,
    paymentMethod: 'COD',
    status: 'shipping',
    orderDate: '2025-01-15 13:15:00',
    deliveryDate: '2025-01-16 09:00:00',
    notes: 'Giao hàng tận nơi',
    createdAt: '2025-01-15T13:15:00Z',
    updatedAt: '2025-01-15T15:20:00Z'
  },
  {
    id: '3',
    orderNumber: '#DH003',
    customer: {
      id: '3',
      name: 'Lê Văn Cường',
      phone: '0909876543',
      email: 'levancuong@gmail.com',
      address: '789 Đường DEF',
      city: 'Hà Nội',
      district: 'Quận Cầu Giấy',
      ward: 'Phường Dịch Vọng'
    },
    items: [
      {
        id: '3',
        productId: '3',
        productName: 'Xiaomi 14',
        variant: '512GB - Trắng',
        quantity: 1,
        unitPrice: 16000000,
        totalPrice: 16000000,
        image: '/images/products/xiaomi14.jpg'
      },
      {
        id: '4',
        productId: '4',
        productName: 'AirPods Pro',
        variant: 'Màu trắng',
        quantity: 1,
        unitPrice: 5000000,
        totalPrice: 5000000,
        image: '/images/products/airpods-pro.jpg'
      }
    ],
    totalAmount: 21000000,
    paymentMethod: 'Momo',
    status: 'completed',
    orderDate: '2025-01-15 11:45:00',
    deliveryDate: '2025-01-15 16:30:00',
    notes: 'Đã giao thành công',
    createdAt: '2025-01-15T11:45:00Z',
    updatedAt: '2025-01-15T16:30:00Z'
  },
  {
    id: '4',
    orderNumber: '#DH004',
    customer: {
      id: '4',
      name: 'Phạm Thị Dung',
      phone: '0905555555',
      email: 'phamthidung@gmail.com',
      address: '321 Đường GHI',
      city: 'Đà Nẵng',
      district: 'Quận Hải Châu',
      ward: 'Phường Thạch Thang'
    },
    items: [
      {
        id: '5',
        productId: '5',
        productName: 'Oppo Find X7',
        variant: '128GB - Vàng',
        quantity: 1,
        unitPrice: 8500000,
        totalPrice: 8500000,
        image: '/images/products/oppo-find-x7.jpg'
      }
    ],
    totalAmount: 8500000,
    paymentMethod: 'BankTransfer',
    status: 'cancelled',
    orderDate: '2025-01-15 10:20:00',
    notes: 'Khách hàng hủy đơn',
    internalNotes: 'Khách hàng thay đổi ý định',
    createdAt: '2025-01-15T10:20:00Z',
    updatedAt: '2025-01-15T12:00:00Z'
  },
  {
    id: '5',
    orderNumber: '#DH005',
    customer: {
      id: '5',
      name: 'Hoàng Văn Em',
      phone: '0901111111',
      email: 'hoangvanem@gmail.com',
      address: '654 Đường JKL',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận 7',
      ward: 'Phường Tân Phú'
    },
    items: [
      {
        id: '6',
        productId: '6',
        productName: 'MacBook Air M3',
        variant: '256GB - Bạc',
        quantity: 1,
        unitPrice: 28000000,
        totalPrice: 28000000,
        image: '/images/products/macbook-air-m3.jpg'
      },
      {
        id: '7',
        productId: '7',
        productName: 'Magic Mouse',
        variant: 'Màu trắng',
        quantity: 1,
        unitPrice: 2000000,
        totalPrice: 2000000,
        image: '/images/products/magic-mouse.jpg'
      }
    ],
    totalAmount: 30000000,
    paymentMethod: 'VNPay',
    status: 'completed',
    orderDate: '2025-01-15 09:30:00',
    deliveryDate: '2025-01-15 14:00:00',
    notes: 'Giao hàng thành công',
    createdAt: '2025-01-15T09:30:00Z',
    updatedAt: '2025-01-15T14:00:00Z'
  }
];


