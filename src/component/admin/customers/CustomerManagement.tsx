// ============================================================================
// IMPORTS
// ============================================================================

import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faFileExport } from '@fortawesome/free-solid-svg-icons';

// Types
import { Customer } from '../admin.types';

// Constants
import { MOCK_CUSTOMERS } from './constants/customerConstants';

// Hooks
import { useCustomerManagement } from './hooks/useCustomerManagement';
import { useToast } from './hooks/useToast';

// Components
import CustomerFiltersComponent from './components/CustomerFilters';
import CustomerTable from './components/CustomerTable';
import CustomerDetailModal from './components/CustomerDetailModal';
import RoleAssignmentModal from './components/RoleAssignmentModal';
import ToastContainer from './components/ToastContainer';

// Styles
import styles from './CustomerManagement.module.scss';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * CustomerManagement - Main component for managing customers in admin panel
 * Features:
 * - Customer listing with pagination and sorting
 * - Customer filtering by role, status, and search
 * - Customer detail view modal
 * - Role assignment functionality
 * - Account lock/unlock functionality
 * - Toast notifications for actions
 */
const CustomerManagement: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [customerToToggle, setCustomerToToggle] = useState<Customer | null>(null);
  
  const { toasts, removeToast, showSuccess, showError } = useToast();
  
  const {
    customers,
    filteredCustomers,
    filters,
    pagination,
    setFilters,
    updateCustomerRole,
    toggleCustomerStatus,
    clearFilters,
    goToPage,
    goToPreviousPage,
    goToNextPage
  } = useCustomerManagement({
    initialCustomers: MOCK_CUSTOMERS,
    itemsPerPage: 10
  });

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, [setFilters]);

  // Handle sort
  const handleSort = useCallback((sortBy: 'name' | 'createdAt' | 'email') => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  }, [setFilters]);

  // Handle view customer
  const handleViewCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  }, []);

  // Handle edit role
  const handleEditRole = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setIsRoleModalOpen(true);
  }, []);

  // Handle toggle status
  const handleToggleStatus = useCallback((customer: Customer) => {
    setCustomerToToggle(customer);
    
    const action = customer.status === 'active' ? 'khóa' : 'mở khóa';
    const confirmMessage = `Bạn có chắc muốn ${action} tài khoản của ${customer.name}?`;
    
    if (window.confirm(confirmMessage)) {
      toggleCustomerStatus(customer.id);
      showSuccess(`Đã ${action} tài khoản của ${customer.name}`);
    }
    
    setCustomerToToggle(null);
  }, [toggleCustomerStatus, showSuccess]);

  // Handle close modals
  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedCustomer(null);
  }, []);

  const handleCloseRoleModal = useCallback(() => {
    setIsRoleModalOpen(false);
    setSelectedCustomer(null);
  }, []);

  // Handle save role
  const handleSaveRole = useCallback((customerId: string, newRole: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      updateCustomerRole(customerId, newRole);
      showSuccess(`Đã cập nhật quyền của ${customer.name} thành ${newRole === 'admin' ? 'Admin' : newRole === 'employee' ? 'Nhân viên' : 'Khách hàng'}`);
    }
  }, [customers, updateCustomerRole, showSuccess]);

  // Handle export
  const handleExport = useCallback(() => {
    try {
      // In a real app, this would call an API to export data
      showSuccess('Đang xuất dữ liệu khách hàng...');
    } catch (error) {
      showError('Có lỗi xảy ra khi xuất dữ liệu');
    }
  }, [showSuccess, showError]);

  return (
    <div className={styles.customerManagement}>
      {/* Header */}
      <div className={styles.header}>
        <h1>
          <FontAwesomeIcon icon={faUsers} style={{ marginRight: '12px' }} />
          Quản lý khách hàng
        </h1>
        <div className={styles.headerActions}>
          <button className="btn btn-outline" onClick={handleExport}>
            <FontAwesomeIcon icon={faFileExport} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Filters */}
      <CustomerFiltersComponent
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      {/* Customers Table */}
      <CustomerTable
        customers={filteredCustomers}
        filters={filters}
        pagination={pagination}
        onViewCustomer={handleViewCustomer}
        onEditRole={handleEditRole}
        onToggleStatus={handleToggleStatus}
        onSort={handleSort}
        onPageChange={goToPage}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
      />

      {/* Customer Detail Modal */}
      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />

      {/* Role Assignment Modal */}
      <RoleAssignmentModal
        customer={selectedCustomer}
        isOpen={isRoleModalOpen}
        onClose={handleCloseRoleModal}
        onSave={handleSaveRole}
      />

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </div>
  );
};

export default CustomerManagement;
