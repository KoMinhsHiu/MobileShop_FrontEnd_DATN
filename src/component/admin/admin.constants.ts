import { 
  faTachometerAlt,
  faBox,
  faShoppingCart,
  faUsers,
  faChartBar,
  faDollarSign,
  faMobileAlt,
  faLayerGroup,
  faTags,
  faWarehouse
} from '@fortawesome/free-solid-svg-icons';
import { 
  MenuItem, 
  DashboardSummaryCard, 
  RevenueData, 
  OrderStatusData, 
  RecentOrder,
} from './admin.types';

export const MENU_ITEMS: MenuItem[] = [
  { icon: faTachometerAlt, label: 'Dashboard', href: '/admin', active: false },
  { icon: faBox, label: 'Quản lý thương hiệu', href: '/admin/brands', active: false },
  { icon: faLayerGroup, label: 'Quản lý danh mục', href: '/admin/categories', active: false },
  { icon: faMobileAlt, label: 'Quản lý điện thoại', href: '/admin/phones', active: false },
  { icon: faShoppingCart, label: 'Quản lý đơn hàng', href: '/admin/orders', active: false },
  { icon: faUsers, label: 'Quản lý khách hàng', href: '/admin/customers', active: false },
  { icon: faTags, label: 'Quản lý voucher', href: '/admin/vouchers', active: false },
  { icon: faWarehouse, label: 'Quản lý tồn kho', href: '/admin/inventory', active: false },
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
  // { 
  //   id: '#AD001', 
  //   customer: 'Nguyễn Văn An', 
  //   amount: '2,450,000', 
  //   status: 'pending', 
  //   date: '2024-01-15 14:30',
  //   items: 2
  // },
  // { 
  //   id: '#AD002', 
  //   customer: 'Trần Thị Bình', 
  //   amount: '1,890,000', 
  //   status: 'shipping', 
  //   date: '2024-01-15 13:15',
  //   items: 1
  // },
  // { 
  //   id: '#AD003', 
  //   customer: 'Lê Văn Cường', 
  //   amount: '3,200,000', 
  //   status: 'completed', 
  //   date: '2024-01-15 11:45',
  //   items: 3
  // },
  // { 
  //   id: '#AD004', 
  //   customer: 'Phạm Thị Dung', 
  //   amount: '850,000', 
  //   status: 'cancelled', 
  //   date: '2024-01-15 10:20',
  //   items: 1
  // },
  // { 
  //   id: '#AD005', 
  //   customer: 'Hoàng Văn Em', 
  //   amount: '4,100,000', 
  //   status: 'completed', 
  //   date: '2024-01-15 09:30',
  //   items: 2
  // }
];

export const NOTIFICATIONS = [
  { id: 1, message: 'Đơn hàng mới #001 cần xác nhận', time: '5 phút trước', type: 'order' as const },
  { id: 2, message: 'Sản phẩm iPhone 15 sắp hết hàng', time: '1 giờ trước', type: 'inventory' as const },
  { id: 3, message: 'Khách hàng mới đăng ký', time: '2 giờ trước', type: 'user' as const },
];