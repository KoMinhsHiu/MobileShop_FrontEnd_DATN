import { StatusHistory, Shipment } from "@/utils/api/orders";
import { Payment } from "@/utils/api/payment";

export interface MenuItem {
  icon: any;
  label: string;
  href: string;
  active: boolean;
}

export interface Notification {
  id: number;
  message: string;
  time: string;
  type: 'order' | 'inventory' | 'user';
}

// Dashboard Summary Card (legacy)
export interface DashboardSummaryCard {
  title: string;
  value: string;
  unit: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: any;
  color: string;
  bgColor: string;
}


export interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

export interface OrderStatusData {
  name: string;
  value: number;
  color: string;
  count: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  amount: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'canceled' | 'failed';
  date: string;
  items: number;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'canceled' | 'failed';

// Order Management Types
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variant: string;
  quantity: number;
  color: string;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

export interface CustomerInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  ward: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  paymentMethod: 'COD' | 'VNPay' | 'Momo' | 'BankTransfer' | 'None';
  status: OrderStatus;
  statusHistory?: StatusHistory[];
  shipments?: Shipment[];
  payments?: Payment[];
  orderDate: string;
  deliveryDate?: string;
  notes?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  search: string;
  status: string;
  paymentMethod: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'orderDate' | 'totalAmount' | 'status';
  sortOrder: 'asc' | 'desc';
}

export interface OrderStatusOption {
  value: OrderStatus;
  label: string;
  color: string;
  icon: string;
}

// Product Management Types
export interface ProductVariant {
  id: string;
  color: string;
  storage: string;
  price: number;
  quantity: number;
  images?: (File | string)[];
}

// New Variant Schema Types
export interface VariantColor {
  colorId: number;
  imageUrl: string;
}

export interface VariantSpecification {
  specId: number;
  info: string;
  unit?: string;
}

export interface VariantFormData {
  phoneId: number;
  variantName: string;
  description: string;
  colors: VariantColor[];
  price: number;
  discountPercent?: number;
  images?: string[];
  specifications: VariantSpecification[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  supplier: string;
  status: 'visible' | 'hidden';
  mainImage: string;
  color?: string;
  colorId?: number | null;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  supplier: string;
  status: 'visible' | 'hidden';
  mainImage: File | string;
  variants: ProductVariant[];
}

export interface ProductFilters {
  search: string;
  category: string;
  supplier: string;
  status: string;
  sortBy: 'createdAt' | 'quantity';
  sortOrder: 'asc' | 'desc';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ProductTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

// ============================================================================
// CUSTOMER MANAGEMENT TYPES
// ============================================================================

/**
 * User role types for customer management
 */
export type UserRole = 'admin' | 'employee' | 'customer';

/**
 * User status types for account state
 */
export type UserStatus = 'active' | 'inactive' | 'banned';

/**
 * Customer address information
 */
export interface CustomerAddress {
  street: string;
  city: string;
  district: string;
  ward: string;
}

/**
 * Customer order summary for detail view
 */
export interface CustomerOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
}

/**
 * Main customer interface with all customer information
 */
export interface Customer {
  id: string;
  avatar?: string;
  name: string;
  email: string;
  username?: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  pointsBalance?: number;
  lastChangePass?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  address?: CustomerAddress;
  orderCount?: number;
  totalSpent?: number;
  orders?: CustomerOrder[];
}

/**
 * Filter options for customer table
 */
export interface CustomerFilters {
  search: string;
  role: string;
  status: string;
  sortBy: 'name' | 'createdAt' | 'email';
  sortOrder: 'asc' | 'desc';
}

/**
 * Role option for dropdown selection
 */
export interface RoleOption {
  value: UserRole;
  label: string;
  icon: string;
  description: string;
}

/**
 * Table column configuration
 */
export interface CustomerTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

