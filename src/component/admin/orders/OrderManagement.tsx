import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { Order } from '../admin.types';
import { MOCK_ORDERS } from '../admin.constants';
import { ORDER_STATUS_OPTIONS } from './constants/orderConstants';
import { useOrderManagement } from './hooks/useOrderManagement';
import { OrderService, handleApiError } from './services/orderService';
import OrderDetailModal from './OrderDetailModal';
import OrderTable from './components/OrderTable';
import OrderFiltersComponent from './components/OrderFilters';
import ToastContainer from './ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorDisplay from './components/ErrorDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import SEOHead from './components/SEOHead';
import { useToast } from './useToast';
import styles from './OrderManagement.module.scss';

const OrderManagement: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toasts, removeToast, showSuccess, showError } = useToast();
  
  const {
    orders,
    filteredOrders,
    filters,
    pagination,
    setFilters,
    updateOrder,
    clearFilters,
    goToPage,
    goToPreviousPage,
    goToNextPage
  } = useOrderManagement({
    initialOrders: MOCK_ORDERS,
    itemsPerPage: 10
  });

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  }, [setFilters, filters]);

  // Handle sort
  const handleSort = useCallback((sortBy: 'orderDate' | 'totalAmount' | 'status') => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    setFilters({
      ...filters,
      sortBy,
      sortOrder: newSortOrder
    });
  }, [setFilters, filters]);

  // Handle view order
  const handleViewOrder = useCallback((order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }, []);

  // Handle close modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  }, []);

  // Handle update order status
  const handleUpdateOrderStatus = useCallback(async (
    orderId: string, 
    status: string, 
    internalNotes?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await OrderService.updateOrderStatus(orderId, status, internalNotes);
      
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Không tìm thấy đơn hàng');
      }
      
      updateOrder(orderId, {
        status: status as any,
        internalNotes,
        updatedAt: new Date().toISOString()
      });
      
      // Get status label
      const statusOption = ORDER_STATUS_OPTIONS.find(option => option.value === status);
      const statusLabel = statusOption?.label || status;
      
      // Show success toast
      showSuccess(
        'Cập nhật thành công',
        `Đơn hàng ${order.orderNumber} đã được chuyển sang trạng thái ${statusLabel}.`
      );
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      showError(
        'Cập nhật thất bại',
        errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  }, [orders, updateOrder, showSuccess, showError]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setError(null);
  }, []);

  // Show loading state
  if (isLoading && !error) {
    return (
      <div className={styles.orderManagement}>
        <LoadingSpinner size="large" message="Đang tải dữ liệu đơn hàng..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.orderManagement}>
        <ErrorDisplay
          title="Lỗi tải dữ liệu"
          message={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <>
      <SEOHead />
      <ErrorBoundary>
        <div className={styles.orderManagement}>
        {/* Header */}
        <div className={styles.header}>
          <h1>
            <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: '12px' }} />
            Quản lý đơn hàng
          </h1>
          <div className={styles.headerActions}>
            <button className="btn btn-outline">
              <FontAwesomeIcon icon={faCalendarAlt} />
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Filters */}
        <OrderFiltersComponent
          filters={filters}
          statusOptions={ORDER_STATUS_OPTIONS}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        {/* Orders Table */}
        <OrderTable
          orders={filteredOrders}
          filters={filters}
          pagination={pagination}
          statusOptions={ORDER_STATUS_OPTIONS}
          onViewOrder={handleViewOrder}
          onSort={handleSort}
          onPageChange={goToPage}
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />

        {/* Order Detail Modal */}
        <OrderDetailModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdateStatus={handleUpdateOrderStatus}
        />

        {/* Toast Notifications */}
        <ToastContainer
          toasts={toasts}
          onRemoveToast={removeToast}
        />
        </div>
      </ErrorBoundary>
    </>
  );
};

export default OrderManagement;
