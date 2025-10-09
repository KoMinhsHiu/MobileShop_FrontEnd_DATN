// ============================================================================
// MAIN COMPONENTS
// ============================================================================

export { default as CustomerManagement } from './CustomerManagement';

// ============================================================================
// SUB COMPONENTS
// ============================================================================

export { default as CustomerTable } from './components/CustomerTable';
export { default as CustomerFiltersComponent } from './components/CustomerFilters';
export { default as CustomerDetailModal } from './components/CustomerDetailModal';
export { default as RoleAssignmentModal } from './components/RoleAssignmentModal';
export { default as ToastContainer } from './components/ToastContainer';

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

export { useCustomerManagement } from './hooks/useCustomerManagement';
export { useToast } from './hooks/useToast';

// ============================================================================
// CONSTANTS & UTILITIES
// ============================================================================

export * from './constants/customerConstants';
