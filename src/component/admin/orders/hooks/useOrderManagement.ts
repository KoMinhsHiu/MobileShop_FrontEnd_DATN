import { useState, useEffect, useCallback } from 'react';
import { Order, OrderFilters, PaginationInfo } from '../../admin.types';
import { filterOrders, sortOrders } from '../utils/orderUtils';

interface UseOrderManagementProps {
  initialOrders: Order[];
  itemsPerPage?: number;
}

interface UseOrderManagementReturn {
  orders: Order[];
  filteredOrders: Order[];
  filters: OrderFilters;
  pagination: PaginationInfo;
  setFilters: (filters: OrderFilters) => void;
  setPagination: (pagination: PaginationInfo) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  clearFilters: () => void;
  goToPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

export const useOrderManagement = ({
  initialOrders,
  itemsPerPage = 10
}: UseOrderManagementProps): UseOrderManagementReturn => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: 'Tất cả',
    paymentMethod: 'Tất cả',
    dateFrom: '',
    dateTo: '',
    sortBy: 'orderDate',
    sortOrder: 'desc'
  });
  
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage
  });

  // Filter and sort orders
  useEffect(() => {
    let filtered = filterOrders(orders, filters);
    filtered = sortOrders(filtered, filters.sortBy, filters.sortOrder);

    // Update pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    const paginatedOrders = filtered.slice(startIndex, endIndex);

    setFilteredOrders(paginatedOrders);
    setPagination(prev => ({
      ...prev,
      totalItems,
      totalPages
    }));
  }, [orders, filters, pagination.currentPage, pagination.itemsPerPage]);

  // Update order
  const updateOrder = useCallback((orderId: string, updates: Partial<Order>) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              ...updates,
              updatedAt: new Date().toISOString()
            }
          : order
      )
    );
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'Tất cả',
      paymentMethod: 'Tất cả',
      dateFrom: '',
      dateTo: '',
      sortBy: 'orderDate',
      sortOrder: 'desc'
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // Pagination handlers
  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  const goToPreviousPage = useCallback(() => {
    if (pagination.currentPage > 1) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  }, [pagination.currentPage]);

  const goToNextPage = useCallback(() => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  }, [pagination.currentPage, pagination.totalPages]);

  return {
    orders,
    filteredOrders,
    filters,
    pagination,
    setFilters,
    setPagination,
    updateOrder,
    clearFilters,
    goToPage,
    goToPreviousPage,
    goToNextPage
  };
};
