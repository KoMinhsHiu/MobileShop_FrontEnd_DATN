// Strict TypeScript types for order management

/**
 * Strict order status type
 */
export type StrictOrderStatus = 'pending' | 'shipping' | 'completed' | 'cancelled';

/**
 * Strict payment method type
 */
export type StrictPaymentMethod = 'COD' | 'VNPay' | 'Momo' | 'BankTransfer';

/**
 * Strict sort field type
 */
export type StrictSortField = 'orderDate' | 'totalAmount' | 'status';

/**
 * Strict sort order type
 */
export type StrictSortOrder = 'asc' | 'desc';

/**
 * Strict order item interface
 */
export interface StrictOrderItem {
  readonly id: string;
  readonly productId: string;
  readonly productName: string;
  readonly variant: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly totalPrice: number;
  readonly image?: string;
}

/**
 * Strict customer info interface
 */
export interface StrictCustomerInfo {
  readonly id: string;
  readonly name: string;
  readonly phone: string;
  readonly email: string;
  readonly address: string;
  readonly city: string;
  readonly district: string;
  readonly ward: string;
}

/**
 * Strict order interface
 */
export interface StrictOrder {
  readonly id: string;
  readonly orderNumber: string;
  readonly customer: StrictCustomerInfo;
  readonly items: readonly StrictOrderItem[];
  readonly totalAmount: number;
  readonly paymentMethod: StrictPaymentMethod;
  readonly status: StrictOrderStatus;
  readonly orderDate: string;
  readonly deliveryDate?: string;
  readonly notes?: string;
  readonly internalNotes?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Strict order filters interface
 */
export interface StrictOrderFilters {
  readonly search: string;
  readonly status: string;
  readonly paymentMethod: string;
  readonly dateFrom: string;
  readonly dateTo: string;
  readonly sortBy: StrictSortField;
  readonly sortOrder: StrictSortOrder;
}

/**
 * Strict pagination info interface
 */
export interface StrictPaginationInfo {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly itemsPerPage: number;
}

/**
 * Strict order status option interface
 */
export interface StrictOrderStatusOption {
  readonly value: StrictOrderStatus;
  readonly label: string;
  readonly color: string;
  readonly icon: string;
}

/**
 * Type guard for order status
 */
export const isOrderStatus = (status: string): status is StrictOrderStatus => {
  return ['pending', 'shipping', 'completed', 'cancelled'].includes(status);
};

/**
 * Type guard for payment method
 */
export const isPaymentMethod = (method: string): method is StrictPaymentMethod => {
  return ['COD', 'VNPay', 'Momo', 'BankTransfer'].includes(method);
};

/**
 * Type guard for sort field
 */
export const isSortField = (field: string): field is StrictSortField => {
  return ['orderDate', 'totalAmount', 'status'].includes(field);
};

/**
 * Type guard for sort order
 */
export const isSortOrder = (order: string): order is StrictSortOrder => {
  return ['asc', 'desc'].includes(order);
};

/**
 * Utility type for partial order updates
 */
export type OrderUpdate = Partial<Pick<StrictOrder, 'status' | 'internalNotes' | 'deliveryDate' | 'notes'>> & {
  readonly updatedAt: string;
};

/**
 * Utility type for order creation
 */
export type OrderCreate = Omit<StrictOrder, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Utility type for order response from API
 */
export type OrderResponse = StrictOrder;

/**
 * Utility type for order list response from API
 */
export type OrderListResponse = {
  readonly orders: readonly StrictOrder[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
};

/**
 * Utility type for error response
 */
export type ErrorResponse = {
  readonly error: string;
  readonly code?: string;
  readonly details?: Record<string, unknown>;
};

/**
 * Utility type for success response
 */
export type SuccessResponse<T = unknown> = {
  readonly success: true;
  readonly data: T;
  readonly message?: string;
};
