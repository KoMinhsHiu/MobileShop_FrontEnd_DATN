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
  onUpdateOrder: (order: Order) => void;
  onSort: (sortBy: 'orderDate' | 'totalAmount' | 'status') => void;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  filters,
  pagination,
  statusOptions,
  onViewOrder,
  onUpdateOrder,
  onSort,
  onPageChange,
  onItemsPerPageChange
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

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableHeader}>
        <div>
          <h3>Danh sách đơn hàng</h3>
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
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
              >
                Trạng thái
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
                        onClick={() => onUpdateOrder(order)}
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
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} trong tổng số {pagination.totalItems} đơn hàng
        </div>

        <div className={styles.paginationControls}>
          <div className={styles.itemsPerPage}>
            <label>Hiển thị:</label>
            <select
              value={pagination.itemsPerPage}
              onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>đơn/trang</span>
          </div>

          <div className={styles.pageControls}>
            <button
              className={styles.paginationButton}
              onClick={() => onPageChange(1)}
              disabled={pagination.currentPage === 1}
              title="Trang đầu"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <button
              className={styles.paginationButton}
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              title="Trang trước"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            {(() => {
              const totalPages = pagination.totalPages;
              const currentPage = pagination.currentPage;
              const pages = [];

              if (totalPages <= 6) {
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(
                    <button
                      key={i}
                      className={`${styles.paginationButton} ${i === currentPage ? styles.active : ''}`}
                      onClick={() => onPageChange(i)}
                    >
                      {i}
                    </button>
                  );
                }
              } else {
                pages.push(
                  <button
                    key={1}
                    className={`${styles.paginationButton} ${1 === currentPage ? styles.active : ''}`}
                    onClick={() => onPageChange(1)}
                  >
                    1
                  </button>
                );

                if (currentPage > 4) {
                  pages.push(<span key="start-ellipsis" className={styles.ellipsis}>...</span>);
                }

                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);
                
                for (let i = start; i <= end; i++) {
                  if (i !== 1 && i !== totalPages) {
                    pages.push(
                      <button
                        key={i}
                        className={`${styles.paginationButton} ${i === currentPage ? styles.active : ''}`}
                        onClick={() => onPageChange(i)}
                      >
                        {i}
                      </button>
                    );
                  }
                }

                if (currentPage < totalPages - 3) {
                  pages.push(<span key="end-ellipsis" className={styles.ellipsis}>...</span>);
                }

                if (totalPages > 1) {
                  pages.push(
                    <button
                      key={totalPages}
                      className={`${styles.paginationButton} ${totalPages === currentPage ? styles.active : ''}`}
                      onClick={() => onPageChange(totalPages)}
                    >
                      {totalPages}
                    </button>
                  );
                }
              }

              return pages;
            })()}

            <button
              className={styles.paginationButton}
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              title="Trang sau"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>

            <button
              className={styles.paginationButton}
              onClick={() => onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              title="Trang cuối"
            >
              <FontAwesomeIcon icon={faChevronRight} />
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
