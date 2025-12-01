import { Customer, CustomerFilters, CustomerTableColumn } from '../../admin.types';

// ============================================================================
// ROLE & STATUS CONFIGURATIONS
// ============================================================================

/**
 * User status options with their display properties
 */
export const STATUS_OPTIONS = [
  { value: 'active', label: 'Hoạt động', color: 'green' },
  { value: 'inactive', label: 'Tạm khóa', color: 'yellow' },
  { value: 'banned', label: 'Bị cấm', color: 'red' }
] as const;

// ============================================================================
// FILTER CONFIGURATIONS
// ============================================================================

/**
 * Default filter values for customer table
 */
export const DEFAULT_CUSTOMER_FILTERS: CustomerFilters = {
  search: '',
  role: '',
  status: '',
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

// ============================================================================
// TABLE CONFIGURATIONS
// ============================================================================

/**
 * Customer table column definitions
 */
export const CUSTOMER_TABLE_COLUMNS: CustomerTableColumn[] = [
  { key: 'avatar', label: 'Ảnh đại diện', sortable: false, width: '80px' },
  { key: 'name', label: 'Họ tên', sortable: true, width: '150px' },
  { key: 'email', label: 'Email', sortable: true, width: '200px' },
  { key: 'phone', label: 'SĐT', sortable: false, width: '120px' },
  { key: 'role', label: 'Quyền', sortable: true, width: '120px' },
  { key: 'status', label: 'Trạng thái', sortable: true, width: '140px' },
  { key: 'createdAt', label: 'Ngày tạo', sortable: true, width: '120px' },
  { key: 'actions', label: 'Hành động', sortable: false, width: '160px' }
];

// ============================================================================
// MOCK DATA
// ============================================================================

/**
 * Mock customer data for development and testing
 */
export const MOCK_CUSTOMERS: Customer[] = [];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================


/**
 * Format date string to Vietnamese locale format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

/**
 * Get status label by status value
 * @param status - Status value
 * @returns Status label string
 */
export const getStatusLabel = (status: string): string => {
  const statusOption = STATUS_OPTIONS.find(option => option.value === status);
  return statusOption?.label || 'Hoạt động';
};

/**
 * Get status color by status value
 * @param status - Status value
 * @returns Status color string
 */
export const getStatusColor = (status: string): string => {
  const statusOption = STATUS_OPTIONS.find(option => option.value === status);
  return statusOption?.color || 'green';
};

/**
 * Get role label by role value
 * @param role - Role value
 * @returns Role label string
 */
export const getRoleLabel = (role: string): string => {
  const roleLabels: Record<string, string> = {
    admin: 'Quản trị viên',
    employee: 'Nhân viên', 
    customer: 'Khách hàng'
  };
  return roleLabels[role] || 'Khách hàng';
};

/**
 * Get role icon by role value
 * @param role - Role value
 * @returns Role icon string
 */
export const getRoleIcon = (role: string): string => {
  const roleIcons: Record<string, string> = {
    admin: '👑',
    employee: '👨‍💼',
    customer: '👤'
  };
  return roleIcons[role] || '👤';
};
