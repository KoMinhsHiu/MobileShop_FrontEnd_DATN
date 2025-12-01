import { Order } from '../../admin.types';

/**
 * Format date to Vietnamese locale
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Calculate total items in an order
 */
export const calculateTotalItems = (order: Order): number => {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
};


/**
 * Get payment method display name
 */
export const getPaymentMethodDisplayName = (method: string): string => {
  const methodNames = {
    COD: 'COD',
    VNPay: 'VNPay',
    Momo: 'Momo',
    BankTransfer: 'Chuyển khoản'
  };
  return methodNames[method as keyof typeof methodNames] || method;
};

/**
 * Validate order data
 */
export const validateOrder = (order: Partial<Order>): string[] => {
  const errors: string[] = [];
  
  if (!order.orderNumber) {
    errors.push('Mã đơn hàng là bắt buộc');
  }
  
  if (!order.customer?.name) {
    errors.push('Tên khách hàng là bắt buộc');
  }
  
  if (!order.customer?.phone) {
    errors.push('Số điện thoại khách hàng là bắt buộc');
  }
  
  if (!order.items || order.items.length === 0) {
    errors.push('Đơn hàng phải có ít nhất 1 sản phẩm');
  }
  
  if (!order.totalAmount || order.totalAmount <= 0) {
    errors.push('Tổng tiền phải lớn hơn 0');
  }
  
  return errors;
};

/**
 * Generate order number
 */
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `#DH${timestamp}${random}`;
};

/**
 * Sort orders by field
 */
export const sortOrders = (
  orders: Order[], 
  sortBy: 'orderDate' | 'totalAmount' | 'status', 
  sortOrder: 'asc' | 'desc'
): Order[] => {
  return [...orders].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'orderDate':
        aValue = new Date(a.orderDate).getTime();
        bValue = new Date(b.orderDate).getTime();
        break;
      case 'totalAmount':
        aValue = a.totalAmount;
        bValue = b.totalAmount;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

/**
 * Filter orders based on criteria
 */
export const filterOrders = (
  orders: Order[],
  filters: {
    search?: string;
    status?: string;
    paymentMethod?: string;
    dateFrom?: string;
    dateTo?: string;
  }
): Order[] => {
  return orders.filter(order => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.customer.phone.includes(searchLower) ||
        order.customer.email.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'Tất cả') {
      if (order.status !== filters.status) return false;
    }

    // Payment method filter
    if (filters.paymentMethod && filters.paymentMethod !== 'Tất cả') {
      if (order.paymentMethod !== filters.paymentMethod) return false;
    }

    // Date range filter
    if (filters.dateFrom) {
      if (new Date(order.orderDate) < new Date(filters.dateFrom)) return false;
    }
    
    if (filters.dateTo) {
      if (new Date(order.orderDate) > new Date(filters.dateTo)) return false;
    }

    return true;
  });
};
