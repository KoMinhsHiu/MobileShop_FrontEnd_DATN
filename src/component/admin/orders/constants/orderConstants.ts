import { OrderStatusOption } from '../../admin.types';

/**
 * Order status options with icons and colors
 */
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

/**
 * Payment method options
 */
export const PAYMENT_METHODS = [
  { value: 'COD', label: 'COD' },
  { value: 'VNPay', label: 'VNPay' },
  { value: 'Momo', label: 'Momo' },
  { value: 'BankTransfer', label: 'Chuyển khoản' }
] as const;

/**
 * Sort options for orders
 */
export const SORT_OPTIONS = [
  { value: 'orderDate', label: 'Ngày đặt' },
  { value: 'totalAmount', label: 'Tổng tiền' },
  { value: 'status', label: 'Trạng thái' }
] as const;

/**
 * Default pagination settings
 */
export const DEFAULT_PAGINATION = {
  itemsPerPage: 10,
  maxVisiblePages: 5
} as const;

/**
 * Toast notification settings
 */
export const TOAST_SETTINGS = {
  defaultDuration: 5000,
  successDuration: 4000,
  errorDuration: 6000
} as const;

/**
 * Table column configurations
 */
export const TABLE_COLUMNS = [
  { key: 'orderNumber', label: 'Mã đơn', sortable: true, width: '120px' },
  { key: 'customer', label: 'Khách hàng', sortable: false, width: '150px' },
  { key: 'orderDate', label: 'Ngày đặt', sortable: true, width: '140px' },
  { key: 'totalAmount', label: 'Tổng tiền', sortable: true, width: '120px' },
  { key: 'paymentMethod', label: 'Thanh toán', sortable: false, width: '100px' },
  { key: 'status', label: 'Trạng thái', sortable: true, width: '120px' },
  { key: 'actions', label: 'Hành động', sortable: false, width: '140px' }
] as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng',
  UPDATE_FAILED: 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng. Vui lòng thử lại.',
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.'
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  ORDER_UPDATED: 'Đơn hàng đã được cập nhật thành công',
  STATUS_UPDATED: 'Trạng thái đơn hàng đã được cập nhật'
} as const;
