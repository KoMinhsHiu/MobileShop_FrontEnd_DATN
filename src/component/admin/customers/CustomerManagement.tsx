// ============================================================================
// IMPORTS
// ============================================================================

import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faFileExport } from '@fortawesome/free-solid-svg-icons';

// Types
import { Customer } from '../admin.types';

// Hooks
import { useCustomerManagement } from './hooks/useCustomerManagement';

// Components
import CustomerFiltersComponent from './components/CustomerFilters';
import CustomerTable from './components/CustomerTable';
import CustomerDetailModal from './components/CustomerDetailModal';

// Styles
import styles from './CustomerManagement.module.scss';
import { message } from 'antd';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const CustomerManagement: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const {
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
  } = useCustomerManagement({
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

  // Handle toggle status (active/inactive)
  const handleToggleStatus = useCallback(async (customer: Customer, newStatus: 'active' | 'inactive') => {
    const action = newStatus === 'active' ? 'mở khóa' : 'tạm khóa';
    const confirmMessage = `Bạn có chắc muốn ${action} tài khoản của ${customer.name}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await updateCustomerStatus(customer.id, newStatus);
        messageApi.success(`Đã ${action} tài khoản của ${customer.name} thành công!`);
      } catch (error: any) {
        messageApi.error(`Lỗi khi ${action} tài khoản: ${error.message}`);
      }
    }
  }, [updateCustomerStatus, messageApi]);

  // Handle ban customer
  const handleBanCustomer = useCallback(async (customer: Customer) => {
    const confirmMessage = `Bạn có chắc muốn cấm vĩnh viễn tài khoản của ${customer.name}? Hành động này không thể hoàn tác.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await updateCustomerStatus(customer.id, 'banned');
        messageApi.success(`Đã cấm tài khoản của ${customer.name} thành công!`);
      } catch (error: any) {
        messageApi.error(`Lỗi khi cấm tài khoản: ${error.message}`);
      }
    }
  }, [updateCustomerStatus, messageApi]);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
  }, [setItemsPerPage]);

  // Handle close modal
  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedCustomer(null);
  }, []);

  return (
    <>
    {contextHolder}
    <div className={styles.customerManagement}>
      {/* Header */}
      <div className={styles.header}>
        <h1>
          <FontAwesomeIcon icon={faUsers} style={{ marginRight: '12px' }} />
          Quản lý khách hàng
        </h1>
        
        <div className={styles.headerActions}>
          <button 
            className={`${styles.btn} ${styles['btn-outline']}`}
            onClick={refetchCustomers}
            disabled={loading}
            title="Làm mới dữ liệu"
          >
            🔄 Làm mới
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className={styles.errorContainer}>
          <div className={styles.errorMessage}>
            ❌ {error}
          </div>
        </div>
      )}

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
        loading={loading}
        onViewCustomer={handleViewCustomer}
        onToggleStatus={handleToggleStatus}
        onBanCustomer={handleBanCustomer}
        onSort={handleSort}
        onPageChange={goToPage}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Customer Detail Modal */}
      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
    </>
  );
};

export default CustomerManagement;
