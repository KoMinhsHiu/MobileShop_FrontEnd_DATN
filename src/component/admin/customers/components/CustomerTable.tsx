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
  faEdit, 
  faLock, 
  faUnlock 
} from '@fortawesome/free-solid-svg-icons';

// Types
import { Customer, CustomerFilters, PaginationInfo } from '../../admin.types';

// Utils
import { 
  formatDate, 
  getRoleIcon, 
  getRoleLabel, 
  getStatusLabel, 
  getStatusColor 
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
  onViewCustomer: (customer: Customer) => void;
  onEditRole: (customer: Customer) => void;
  onToggleStatus: (customer: Customer) => void;
  onSort: (sortBy: 'name' | 'createdAt' | 'email') => void;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * CustomerTable - Displays customer data in a table format with sorting and pagination
 * Features:
 * - Sortable columns (name, email, created date)
 * - Pagination controls
 * - Action buttons (view, edit role, lock/unlock)
 * - Responsive design
 * - Empty state handling
 */
const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  filters,
  pagination,
  onViewCustomer,
  onEditRole,
  onToggleStatus,
  onSort,
  onPageChange,
  onPreviousPage,
  onNextPage
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
            <th style={{ width: '80px' }}>Ảnh đại diện</th>
            <th 
              className={styles.sortable}
              style={{ width: '150px' }}
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
            <th 
              className={styles.sortable}
              style={{ width: '120px' }}
            >
              Quyền
            </th>
            <th 
              className={styles.sortable}
              style={{ width: '140px' }}
            >
              Trạng thái
            </th>
            <th 
              className={styles.sortable}
              style={{ width: '120px' }}
              onClick={() => handleSort('createdAt')}
            >
              Ngày tạo
              {getSortIcon('createdAt')}
            </th>
            <th style={{ width: '160px' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>
                {customer.avatar ? (
                  <img 
                    src={customer.avatar} 
                    alt={customer.name}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    👤
                  </div>
                )}
              </td>
              <td>
                <div style={{ fontWeight: '500' }}>
                  {customer.name}
                </div>
              </td>
              <td>
                <a 
                  href={`mailto:${customer.email}`}
                  className={styles.email}
                >
                  {customer.email}
                </a>
              </td>
              <td>
                <span className={styles.phone}>
                  {customer.phone}
                </span>
              </td>
              <td>
                <div className={styles.roleBadge}>
                  <span className={styles.roleIcon}>
                    {getRoleIcon(customer.role)}
                  </span>
                  {getRoleLabel(customer.role)}
                </div>
              </td>
              <td>
                <span 
                  className={`${styles.statusBadge} ${styles[customer.status]}`}
                >
                  {customer.status === 'active' ? '✅' : '🔒'} {getStatusLabel(customer.status)}
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
                  <button
                    className={`${styles.btn} ${styles['btn-edit']}`}
                    onClick={() => onEditRole(customer)}
                    title="Phân quyền"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Quyền
                  </button>
                  <button
                    className={`${styles.btn} ${customer.status === 'active' ? styles['btn-lock'] : styles['btn-unlock']}`}
                    onClick={() => onToggleStatus(customer)}
                    title={customer.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                  >
                    <FontAwesomeIcon icon={customer.status === 'active' ? faLock : faUnlock} />
                    {customer.status === 'active' ? 'Khóa' : 'Mở'}
                  </button>
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
