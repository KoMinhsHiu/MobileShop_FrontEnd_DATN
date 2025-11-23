import { useState, useCallback, useMemo, useEffect } from 'react';
import { Customer, CustomerFilters, PaginationInfo } from '../../admin.types';
import { DEFAULT_CUSTOMER_FILTERS } from '../constants/customerConstants';
import { customerAPI, CustomerData } from '@/utils/api/customer';
import { authAPI } from '@/utils/api/auth';

// ============================================================================
// INTERFACES
// ============================================================================

interface UseCustomerManagementProps {
  itemsPerPage?: number;
}

interface UseCustomerManagementReturn {
  customers: Customer[];
  filteredCustomers: Customer[];
  filters: CustomerFilters;
  pagination: PaginationInfo & { paginatedCustomers: Customer[] };
  loading: boolean;
  error: string | null;
  setFilters: React.Dispatch<React.SetStateAction<CustomerFilters>>;
  setItemsPerPage: (limit: number) => void;
  updateCustomerStatus: (customerId: string, status: 'active' | 'inactive' | 'banned') => Promise<void>;
  clearFilters: () => void;
  goToPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  refetchCustomers: () => Promise<void>;
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert API CustomerData to Customer interface
 */
const convertCustomerData = (customerData: CustomerData): Customer => {
  return {
    id: customerData.id.toString(),
    name: `${customerData.lastName} ${customerData.firstName}`.trim(),
    email: customerData.user.email,
    phone: customerData.user.phone,
    username: customerData.user.username,
    gender: customerData.gender,
    dateOfBirth: customerData.dateOfBirth,
    pointsBalance: customerData.pointsBalance,
    lastChangePass: customerData.user.lastChangePass,
    role: 'customer', // Default role for customers
    status: customerData.user.status || 'active',
    createdAt: customerData.createdAt,
    updatedAt: customerData.updatedAt
  };
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================

/**
 * Custom hook for managing customer data, filtering, sorting, and pagination
 * @param props - Hook configuration
 * @returns Customer management state and actions
 */
export const useCustomerManagement = ({ 
  itemsPerPage = 10 
}: UseCustomerManagementProps): UseCustomerManagementReturn => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filters, setFilters] = useState<CustomerFilters>(DEFAULT_CUSTOMER_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItemsPerPage, setCurrentItemsPerPage] = useState(itemsPerPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  // ============================================================================
  // API OPERATIONS
  // ============================================================================

  /**
   * Fetch customers from API
   */
  const fetchCustomers = useCallback(async (page: number = 1, limit: number = currentItemsPerPage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerAPI.listCustomers(page, limit);
      const convertedCustomers = response.data.data.map(convertCustomerData);
      setCustomers(convertedCustomers);
      setTotalItems(response.data.total);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách khách hàng');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  }, [currentItemsPerPage]);

  /**
   * Update customer status via API
   */
  const updateCustomerStatus = useCallback(async (customerId: string, status: 'active' | 'inactive' | 'banned') => {
    try {
      await authAPI.updateUserStatus(customerId, status);
      // Update local state
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId 
          ? { ...customer, status, updatedAt: new Date().toISOString() }
          : customer
      ));
    } catch (err: any) {
      throw new Error(err.message || 'Không thể cập nhật trạng thái khách hàng');
    }
  }, []);

  // ============================================================================
  // EFFECT HOOKS
  // ============================================================================

  /**
   * Initial data fetch and refetch when page or itemsPerPage changes
   */
  useEffect(() => {
    fetchCustomers(currentPage, currentItemsPerPage);
  }, [fetchCustomers, currentPage, currentItemsPerPage]);

  /**
   * Reset current page when filters change
   */
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filters, currentPage]);

  // ============================================================================
  // FILTERING & SORTING LOGIC
  // ============================================================================

  /**
   * Filter and sort customers based on current filters (client-side filtering)
   */
  const filteredCustomers = useMemo(() => {
    let filtered = [...customers];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phone.includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(customer => customer.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [customers, filters]);

  // ============================================================================
  // PAGINATION LOGIC
  // ============================================================================

  /**
   * Calculate pagination information - use API pagination, client filtering for display
   */
  const pagination: PaginationInfo & { paginatedCustomers: Customer[] } = useMemo(() => {
    // For server-side pagination, show all filtered customers
    const totalPages = Math.ceil(totalItems / currentItemsPerPage);
    
    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: currentItemsPerPage,
      paginatedCustomers: filteredCustomers // Show filtered results
    };
  }, [filteredCustomers, currentPage, currentItemsPerPage, totalItems]);

  // ============================================================================
  // ACTION FUNCTIONS
  // ============================================================================

  /**
   * Update items per page and refetch data
   */
  const setItemsPerPage = useCallback((limit: number) => {
    setCurrentItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page
  }, []);

  /**
   * Clear all filters and reset to default
   */
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_CUSTOMER_FILTERS);
    setCurrentPage(1);
  }, []);

  /**
   * Manually refetch customers
   */
  const refetchCustomers = useCallback(async () => {
    await fetchCustomers(currentPage, currentItemsPerPage);
  }, [fetchCustomers, currentPage, currentItemsPerPage]);

  // ============================================================================
  // PAGINATION HANDLERS
  // ============================================================================

  /**
   * Navigate to specific page
   */
  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  /**
   * Navigate to previous page
   */
  const goToPreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  /**
   * Navigate to next page
   */
  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1));
  }, [pagination.totalPages]);

  // ============================================================================
  // RETURN VALUES
  // ============================================================================

  return {
    customers,
    filteredCustomers,
    filters,
    pagination,
    loading,
    error,
    setFilters,
    setItemsPerPage,
    updateCustomerStatus,
    clearFilters,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    refetchCustomers
  };
};
