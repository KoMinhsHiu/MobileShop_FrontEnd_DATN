// ============================================================================
// IMPORTS
// ============================================================================

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSort, 
  faSortUp, 
  faSortDown, 
  faEye,
  faLock, 
  faUnlock, 
  faBan
} from '@fortawesome/free-solid-svg-icons';

// Types
import { Customer, CustomerFilters, PaginationInfo } from '../../admin.types';

// Utils
import { 
  formatDate,
  getStatusLabel, 
} from '../constants/customerConstants';

// Styles
import styles from '../CustomerManagement.module.scss';

// ============================================================================
// INTERFACES
// ============================================================================

interface CustomerTableProps {
  customers: Customer[];
  filters: CustomerFilters;
  pagination: PaginationInfo & { paginatedCustomers: Customer[] };
  loading?: boolean;
  onViewCustomer: (customer: Customer) => void;
  onToggleStatus: (customer: Customer, newStatus: 'active' | 'inactive') => void;
  onBanCustomer: (customer: Customer) => void;
  onSort: (sortBy: 'name' | 'createdAt' | 'email') => void;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onItemsPerPageChange: (limit: number) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  filters,
  pagination,
  loading = false,
  onViewCustomer,
  onToggleStatus,
  onBanCustomer,
  onSort,
  onPageChange,
  onPreviousPage,
  onNextPage,
  onItemsPerPageChange
}) => {
  const { paginatedCustomers, currentPage, totalPages, totalItems, itemsPerPage } = pagination;

  const getSortIcon = (column: string) => {
    if (filters.sortBy !== column) {
      return <FontAwesomeIcon icon={faSort} className={styles.sortIcon} />;
    }
    return (
      <FontAwesomeIcon 
        icon={filters.sortOrder === 'asc' ? faSortUp : faSortDown} 
        className={`${styles.sortIcon} ${styles.active}`} 
      />
    );
  };

  const handleSort = (column: 'name' | 'createdAt' | 'email') => {
    onSort(column);
  };

  const renderPaginationNumbers = () => {
    const numbers = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      numbers.push(
        <button
          key={i}
          className={`${styles.btn} ${i === currentPage ? styles.active : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    return numbers;
  };

  const handleToggleStatus = (customer: Customer) => {
    const newStatus = customer.status === 'active' ? 'inactive' : 'active';
    onToggleStatus(customer, newStatus);
  };

  const handleBanCustomer = (customer: Customer) => {
    onBanCustomer(customer);
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Đang tải danh sách khách hàng...</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>👥</div>
        <h3>Không có khách hàng nào</h3>
        <p>Chưa có dữ liệu khách hàng để hiển thị.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th 
              className={styles.sortable}
              style={{ width: '180px' }}
              onClick={() => handleSort('name')}
            >
              Họ tên
              {getSortIcon('name')}
            </th>
            <th 
              className={styles.sortable}
              style={{ width: '200px' }}
              onClick={() => handleSort('email')}
            >
              Email
              {getSortIcon('email')}
            </th>
            <th style={{ width: '120px' }}>SĐT</th>
            <th style={{ width: '130px' }}>Trạng thái</th>
            <th 
              className={styles.sortable}
              style={{ width: '120px' }}
              onClick={() => handleSort('createdAt')}
            >
              Ngày tạo
              {getSortIcon('createdAt')}
            </th>
            <th style={{ width: '120px' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <div style={{ fontWeight: '500' }}>
                  {customer.name}
                </div>
              </td>
              <td>
                <span className={styles.email}>
                  {customer.email}
                </span>
              </td>
              <td>
                <span className={styles.phone}>
                  {customer.phone}
                </span>
              </td>
              <td>
                <span 
                  className={`${styles.statusBadge} ${styles[customer.status]}`}
                >
                  {customer.status === 'active' ? '✅' : customer.status === 'inactive' ? '🔒' : '🚫'} 
                  {getStatusLabel(customer.status)}
                </span>
              </td>
              <td>
                {formatDate(customer.createdAt)}
              </td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={`${styles.btn} ${styles['btn-view']}`}
                    onClick={() => onViewCustomer(customer)}
                    title="Xem chi tiết"
                  >
                    <FontAwesomeIcon icon={faEye} />
                    Xem
                  </button>
                  
                  {customer.status !== 'banned' && (
                    <button
                      className={`${styles.btn} ${customer.status === 'active' ? styles['btn-lock'] : styles['btn-unlock']}`}
                      onClick={() => handleToggleStatus(customer)}
                      title={customer.status === 'active' ? 'Tạm khóa tài khoản' : 'Mở khóa tài khoản'}
                    >
                      <FontAwesomeIcon icon={customer.status === 'active' ? faLock : faUnlock} />
                      {customer.status === 'active' ? 'Khóa' : 'Mở'}
                    </button>
                  )}
                  
                  {customer.status !== 'banned' && (
                    <button
                      className={`${styles.btn} ${styles['btn-ban']}`}
                      onClick={() => handleBanCustomer(customer)}
                      title="Cấm tài khoản"
                    >
                      <FontAwesomeIcon icon={faBan} />
                      Cấm
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số {totalItems} khách hàng
        </div>
        
        {/* Items per page selector */}
        <div className={styles.itemsPerPage}>
          <label>Hiển thị:</label>
          <select 
            value={itemsPerPage} 
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className={styles.itemsPerPageSelect}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>mục/trang</span>
        </div>
        
        <div className={styles.paginationControls}>
          <button
            className={styles.btn}
            onClick={onPreviousPage}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          
          <div className={styles.pageNumbers}>
            {renderPaginationNumbers()}
          </div>
          
          <button
            className={styles.btn}
            onClick={onNextPage}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
