import { useState, useCallback, useMemo } from 'react';
import { Customer, CustomerFilters, PaginationInfo } from '../../admin.types';
import { DEFAULT_CUSTOMER_FILTERS } from '../constants/customerConstants';

// ============================================================================
// INTERFACES
// ============================================================================

interface UseCustomerManagementProps {
  initialCustomers: Customer[];
  itemsPerPage?: number;
}

interface UseCustomerManagementReturn {
  customers: Customer[];
  filteredCustomers: Customer[];
  filters: CustomerFilters;
  pagination: PaginationInfo & { paginatedCustomers: Customer[] };
  setFilters: React.Dispatch<React.SetStateAction<CustomerFilters>>;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  updateCustomerRole: (customerId: string, role: string) => void;
  toggleCustomerStatus: (customerId: string) => void;
  clearFilters: () => void;
  goToPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================

/**
 * Custom hook for managing customer data, filtering, sorting, and pagination
 * @param props - Hook configuration
 * @returns Customer management state and actions
 */
export const useCustomerManagement = ({ 
  initialCustomers, 
  itemsPerPage = 10 
}: UseCustomerManagementProps): UseCustomerManagementReturn => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [filters, setFilters] = useState<CustomerFilters>(DEFAULT_CUSTOMER_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  // ============================================================================
  // FILTERING & SORTING LOGIC
  // ============================================================================

  /**
   * Filter and sort customers based on current filters
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

    // Apply role filter
    if (filters.role) {
      filtered = filtered.filter(customer => customer.role === filters.role);
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
   * Calculate pagination information and get paginated customers
   */
  const pagination: PaginationInfo & { paginatedCustomers: Customer[] } = useMemo(() => {
    const totalItems = filteredCustomers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      paginatedCustomers
    };
  }, [filteredCustomers, currentPage, itemsPerPage]);

  // ============================================================================
  // ACTION FUNCTIONS
  // ============================================================================

  /**
   * Update customer information
   */
  const updateCustomer = useCallback((customerId: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId 
        ? { ...customer, ...updates, updatedAt: new Date().toISOString() }
        : customer
    ));
  }, []);

  /**
   * Update customer role
   */
  const updateCustomerRole = useCallback((customerId: string, role: string) => {
    updateCustomer(customerId, { role: role as any });
  }, [updateCustomer]);

  /**
   * Toggle customer status between active and inactive
   */
  const toggleCustomerStatus = useCallback((customerId: string) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId 
        ? { 
            ...customer, 
            status: customer.status === 'active' ? 'inactive' : 'active',
            updatedAt: new Date().toISOString()
          }
        : customer
    ));
  }, []);

  /**
   * Clear all filters and reset to default
   */
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_CUSTOMER_FILTERS);
    setCurrentPage(1);
  }, []);

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
    setFilters,
    updateCustomer,
    updateCustomerRole,
    toggleCustomerStatus,
    clearFilters,
    goToPage,
    goToPreviousPage,
    goToNextPage
  };
};
