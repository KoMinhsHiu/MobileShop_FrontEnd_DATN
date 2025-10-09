import { RoleOption, Customer, CustomerFilters, CustomerTableColumn } from '../../admin.types';

// ============================================================================
// ROLE & STATUS CONFIGURATIONS
// ============================================================================

/**
 * Available user roles with their display information
 */
export const ROLE_OPTIONS: RoleOption[] = [
  {
    value: 'admin',
    label: 'Admin',
    icon: '👑',
    description: 'Quyền quản trị viên cao nhất'
  },
  {
    value: 'employee',
    label: 'Nhân viên',
    icon: '🧑‍💼',
    description: 'Quyền nhân viên'
  },
  {
    value: 'customer',
    label: 'Khách hàng',
    icon: '👤',
    description: 'Quyền khách hàng thông thường'
  }
];

/**
 * User status options with their display properties
 */
export const STATUS_OPTIONS = [
  { value: 'active', label: 'Hoạt động', color: 'green' },
  { value: 'inactive', label: 'Khóa', color: 'red' }
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
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    avatar: '/images/avatars/user1.jpg',
    name: 'Nguyễn Văn A',
    email: 'a@gmail.com',
    phone: '0909123456',
    role: 'customer',
    status: 'active',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
    address: {
      street: '123 Đường ABC',
      city: 'Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé'
    },
    orderCount: 5,
    totalSpent: 12500000,
    orders: [
      {
        id: '1',
        orderNumber: '#DH021',
        orderDate: '2024-10-02T10:30:00Z',
        totalAmount: 1250000,
        status: 'completed'
      },
      {
        id: '2',
        orderNumber: '#DH015',
        orderDate: '2024-09-28T14:20:00Z',
        totalAmount: 890000,
        status: 'completed'
      }
    ]
  },
  {
    id: '2',
    avatar: '/images/avatars/user2.jpg',
    name: 'Trần Thị B',
    email: 'b@gmail.com',
    phone: '0909876543',
    role: 'customer',
    status: 'active',
    createdAt: '2024-02-20T09:15:00Z',
    updatedAt: '2024-02-20T09:15:00Z',
    address: {
      street: '456 Đường XYZ',
      city: 'Hà Nội',
      district: 'Quận Ba Đình',
      ward: 'Phường Phúc Xá'
    },
    orderCount: 3,
    totalSpent: 7500000,
    orders: [
      {
        id: '3',
        orderNumber: '#DH018',
        orderDate: '2024-10-01T16:45:00Z',
        totalAmount: 2100000,
        status: 'shipping'
      }
    ]
  },
  {
    id: '3',
    avatar: '/images/avatars/user3.jpg',
    name: 'Lê Văn C',
    email: 'c@gmail.com',
    phone: '0909555666',
    role: 'employee',
    status: 'active',
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-03-10T11:00:00Z',
    address: {
      street: '789 Đường DEF',
      city: 'Đà Nẵng',
      district: 'Quận Hải Châu',
      ward: 'Phường Thạch Thang'
    },
    orderCount: 0,
    totalSpent: 0,
    orders: []
  },
  {
    id: '4',
    avatar: '/images/avatars/user4.jpg',
    name: 'Phạm Thị D',
    email: 'd@gmail.com',
    phone: '0909444777',
    role: 'customer',
    status: 'inactive',
    createdAt: '2024-01-05T07:30:00Z',
    updatedAt: '2024-09-15T15:20:00Z',
    address: {
      street: '321 Đường GHI',
      city: 'Cần Thơ',
      district: 'Quận Ninh Kiều',
      ward: 'Phường Cái Khế'
    },
    orderCount: 2,
    totalSpent: 3200000,
    orders: [
      {
        id: '4',
        orderNumber: '#DH012',
        orderDate: '2024-08-20T13:10:00Z',
        totalAmount: 1800000,
        status: 'completed'
      }
    ]
  },
  {
    id: '5',
    avatar: '/images/avatars/user5.jpg',
    name: 'Hoàng Văn E',
    email: 'e@gmail.com',
    phone: '0909333888',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    address: {
      street: '654 Đường JKL',
      city: 'Hồ Chí Minh',
      district: 'Quận 3',
      ward: 'Phường Võ Thị Sáu'
    },
    orderCount: 1,
    totalSpent: 500000,
    orders: [
      {
        id: '5',
        orderNumber: '#DH001',
        orderDate: '2024-06-15T09:00:00Z',
        totalAmount: 500000,
        status: 'completed'
      }
    ]
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format currency amount to Vietnamese Dong format
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Format date string to Vietnamese locale format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

/**
 * Get role icon by role value
 * @param role - Role value
 * @returns Role icon string
 */
export const getRoleIcon = (role: string): string => {
  const roleOption = ROLE_OPTIONS.find(option => option.value === role);
  return roleOption?.icon || '👤';
};

/**
 * Get role label by role value
 * @param role - Role value
 * @returns Role label string
 */
export const getRoleLabel = (role: string): string => {
  const roleOption = ROLE_OPTIONS.find(option => option.value === role);
  return roleOption?.label || 'Khách hàng';
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
