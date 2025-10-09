import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faEdit, 
  faChevronLeft, 
  faChevronRight,
  faSort,
  faSortUp,
  faSortDown
} from '@fortawesome/free-solid-svg-icons';
import { Order, OrderFilters, PaginationInfo, OrderStatusOption } from '../../admin.types';
import { formatCurrency, formatDate } from '../utils/orderUtils';
import styles from '../OrderManagement.module.scss';

interface OrderTableProps {
  orders: Order[];
  filters: OrderFilters;
  pagination: PaginationInfo;
  statusOptions: OrderStatusOption[];
  onViewOrder: (order: Order) => void;
  onSort: (sortBy: 'orderDate' | 'totalAmount' | 'status') => void;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  filters,
  pagination,
  statusOptions,
  onViewOrder,
  onSort,
  onPageChange,
  onPreviousPage,
  onNextPage
}) => {
  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    if (!statusOption) return null;

    return (
      <span className={`${styles.statusBadge} ${styles[status]}`}>
        <span>{statusOption.icon}</span>
        {statusOption.label}
      </span>
    );
  };

  // Get payment method badge
  const getPaymentMethodBadge = (method: string) => {
    const methodClass = method.toLowerCase().replace(/\s+/g, '');
    return (
      <span className={`${styles.paymentMethod} ${styles[methodClass]}`}>
        {method}
      </span>
    );
  };

  // Get sort icon
  const getSortIcon = (column: 'orderDate' | 'totalAmount' | 'status') => {
    if (filters.sortBy !== column) {
      return <FontAwesomeIcon icon={faSort} />;
    }
    return filters.sortOrder === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} />
      : <FontAwesomeIcon icon={faSortDown} />;
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeader}>
        <div>
          <h3>Danh sách đơn hàng</h3>
          <div className={styles.tableInfo}>
            Hiển thị {orders.length} trong tổng số {pagination.totalItems} đơn hàng
          </div>
        </div>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th 
                onClick={() => onSort('orderDate')}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSort('orderDate')}
                aria-label="Sắp xếp theo mã đơn hàng"
              >
                Mã đơn {getSortIcon('orderDate')}
              </th>
              <th>Khách hàng</th>
              <th 
                onClick={() => onSort('orderDate')}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSort('orderDate')}
                aria-label="Sắp xếp theo ngày đặt"
              >
                Ngày đặt {getSortIcon('orderDate')}
              </th>
              <th 
                onClick={() => onSort('totalAmount')}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSort('totalAmount')}
                aria-label="Sắp xếp theo tổng tiền"
              >
                Tổng tiền {getSortIcon('totalAmount')}
              </th>
              <th>Thanh toán</th>
              <th 
                onClick={() => onSort('status')}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSort('status')}
                aria-label="Sắp xếp theo trạng thái"
              >
                Trạng thái {getSortIcon('status')}
              </th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className={styles.orderId}>{order.orderNumber}</td>
                  <td className={styles.customerName}>{order.customer.name}</td>
                  <td className={styles.orderDate}>{formatDate(order.orderDate)}</td>
                  <td className={styles.amount}>{formatCurrency(order.totalAmount)}</td>
                  <td>{getPaymentMethodBadge(order.paymentMethod)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={`${styles.viewBtn} btn`}
                        onClick={() => onViewOrder(order)}
                        aria-label={`Xem chi tiết đơn hàng ${order.orderNumber}`}
                      >
                        <FontAwesomeIcon icon={faEye} />
                        Xem
                      </button>
                      <button 
                        className={`${styles.editBtn} btn`}
                        onClick={() => onViewOrder(order)}
                        aria-label={`Cập nhật đơn hàng ${order.orderNumber}`}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                        Cập nhật
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📦</div>
                    <h3>Không tìm thấy đơn hàng</h3>
                    <p>Thử thay đổi bộ lọc để tìm kiếm đơn hàng khác</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Trang {pagination.currentPage} / {pagination.totalPages}
          </div>
          
          <div className={styles.paginationControls}>
            <button 
              onClick={onPreviousPage}
              disabled={pagination.currentPage === 1}
              aria-label="Trang trước"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            
            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={page === pagination.currentPage ? styles.active : ''}
                aria-label={`Trang ${page}`}
                aria-current={page === pagination.currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
            
            <button 
              onClick={onNextPage}
              disabled={pagination.currentPage === pagination.totalPages}
              aria-label="Trang sau"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
