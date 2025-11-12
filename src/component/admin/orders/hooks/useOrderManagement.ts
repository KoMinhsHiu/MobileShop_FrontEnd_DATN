import { useState, useEffect, useCallback } from 'react';
import { Order, OrderFilters, PaginationInfo } from '../../admin.types';
import { filterOrders, sortOrders } from '../utils/orderUtils';
import ordersAPI from '@/utils/api/orders';

interface UseOrderManagementProps {
  itemsPerPage?: number;
}

interface UseOrderManagementReturn {
  orders: Order[];
  filteredOrders: Order[];
  filters: OrderFilters;
  pagination: PaginationInfo;
  isLoading: boolean;
  error: string | null;
  setFilters: (filters: OrderFilters) => void;
  setPagination: (pagination: PaginationInfo) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  clearFilters: () => void;
  goToPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  refetch: () => void;
  handleItemsPerPageChange: (itemsPerPage: number) => void;
}

export const useOrderManagement = ({
  itemsPerPage = 10
}: UseOrderManagementProps): UseOrderManagementReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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

  const { listOrders } = ordersAPI;

  // Fetch orders from API
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await listOrders(pagination.currentPage, pagination.itemsPerPage);

      if (response.status === 200) {
        // Map API orders to component Order type
        const mappedOrders = response.data.data.map(apiOrder => ({
          id: apiOrder.id.toString(),
          orderNumber: apiOrder.orderCode,
          customer: {
            id: apiOrder.customerId.toString(),
            name: apiOrder.recipientName,
            email: '', // Not available in API response
            phone: apiOrder.recipientPhone,
            address: `${apiOrder.street}, ${apiOrder.commune.name}, ${apiOrder.province.name}`,
            city: apiOrder.province.name,
            district: '',
            ward: apiOrder.commune.name
          },
          orderDate: apiOrder.orderDate,
          status: apiOrder.status,
          totalAmount: apiOrder.totalAmount,
          discountAmount: apiOrder.discountAmount,
          shippingFee: apiOrder.shippingFee,
          finalAmount: apiOrder.finalAmount,
          paymentMethod: (apiOrder.payments?.[0]?.paymentMethod?.code || 'COD') as 'COD' | 'VNPay' | 'Momo' | 'BankTransfer',
          items: apiOrder.items.map(item => ({
            id: item.id.toString(),
            productId: item.variant.phoneId.toString(),
            productName: item.variant.name,
            variant: item.variant.variantName,
            quantity: item.quantity,
            color: item.variant.color,
            unitPrice: item.discount || item.price,
            totalPrice: (item.discount || item.price) * item.quantity,
            image: item.variant.imageUrl
          })),
          statusHistory: apiOrder.statusHistory,
          shipments: apiOrder.shipments,
          payments: apiOrder.payments,
          internalNotes: apiOrder.statusHistory?.[0]?.note || '',
          createdAt: apiOrder.orderDate,
          updatedAt: apiOrder.orderDate
        }));
        
        setOrders(mappedOrders);
        setPagination(prev => ({
          ...prev,
          totalItems: response.data.total,
          totalPages: Math.ceil(response.data.total / prev.itemsPerPage)
        }));
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching order list:', err);
    } finally {
      setIsLoading(false);
    }
  }, [listOrders, pagination.currentPage, pagination.itemsPerPage]);

  // Fetch data on mount and when pagination changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter and sort orders (client-side filtering on current page data)
  useEffect(() => {
    let filtered = filterOrders(orders, filters);
    filtered = sortOrders(filtered, filters.sortBy, filters.sortOrder);
    setFilteredOrders(filtered);
  }, [orders, filters]);

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
    // Reset filters when changing page to avoid confusion
    setFilters({
      search: '',
      status: 'Tất cả',
      paymentMethod: 'Tất cả',
      dateFrom: '',
      dateTo: '',
      sortBy: 'orderDate',
      sortOrder: 'desc'
    });
  }, []);

  const goToPreviousPage = useCallback(() => {
    if (pagination.currentPage > 1) {
      const newPage = pagination.currentPage - 1;
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      // Reset filters when changing page
      setFilters({
        search: '',
        status: 'Tất cả',
        paymentMethod: 'Tất cả',
        dateFrom: '',
        dateTo: '',
        sortBy: 'orderDate',
        sortOrder: 'desc'
      });
    }
  }, [pagination.currentPage]);

  const goToNextPage = useCallback(() => {
    if (pagination.currentPage < pagination.totalPages) {
      const newPage = pagination.currentPage + 1;
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      // Reset filters when changing page
      setFilters({
        search: '',
        status: 'Tất cả',
        paymentMethod: 'Tất cả',
        dateFrom: '',
        dateTo: '',
        sortBy: 'orderDate',
        sortOrder: 'desc'
      });
    }
  }, [pagination.currentPage, pagination.totalPages]);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((itemsPerPage: number) => {
    setPagination(prev => ({ 
      ...prev, 
      itemsPerPage,
      currentPage: 1
    }));
    // Reset filters when changing items per page
    setFilters({
      search: '',
      status: 'Tất cả',
      paymentMethod: 'Tất cả',
      dateFrom: '',
      dateTo: '',
      sortBy: 'orderDate',
      sortOrder: 'desc'
    });
  }, []);

  // Refetch function
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    orders,
    filteredOrders,
    filters,
    pagination,
    isLoading,
    error,
    setFilters,
    setPagination,
    updateOrder,
    clearFilters,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    refetch,
    handleItemsPerPageChange
  };
};
