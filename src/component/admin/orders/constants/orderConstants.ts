import { OrderStatusOption } from '../../admin.types';

/**
 * Order status options with icons and colors
 */
export const ORDER_STATUS_OPTIONS: OrderStatusOption[] = [
  {
    value: 'pending',
    label: 'Chờ xác nhận',
    color: '#FBBF24', // amber
    icon: '⏳'
  },
  {
    value: 'paid',
    label: 'Đã thanh toán',
    color: '#06B6D4', // cyan
    icon: '💳'
  },
  {
    value: 'processing',
    label: 'Đang xử lý',
    color: '#6366F1', // indigo
    icon: '⚙️'
  },
  {
    value: 'shipped',
    label: 'Đang giao',
    color: '#3B82F6', // blue
    icon: '🚚'
  },
  {
    value: 'delivered',
    label: 'Đã giao',
    color: '#10B981', // green
    icon: '✅'
  },
  {
    value: 'canceled',
    label: 'Đã hủy',
    color: '#EF4444', // red
    icon: '🛑'
  },
  {
    value: 'failed',
    label: 'Thất bại',
    color: '#B91C1C', // dark red
    icon: '⚠️'
  }
];

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
