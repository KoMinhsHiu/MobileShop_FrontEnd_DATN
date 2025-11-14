import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CustomerFilters } from '../../admin.types';
import { STATUS_OPTIONS } from '../constants/customerConstants';
import styles from '../CustomerManagement.module.scss';

interface CustomerFiltersProps {
  filters: CustomerFilters;
  onFilterChange: (key: keyof CustomerFilters, value: string) => void;
  onClearFilters: () => void;
  onResetOnPageChange?: boolean;
}

const CustomerFiltersComponent: React.FC<CustomerFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const handleInputChange = (key: keyof CustomerFilters, value: string) => {
    onFilterChange(key, value);
  };

  const hasActiveFilters = filters.search || filters.role || filters.status;

  return (
    <div className={styles.filters}>
      <div className={styles.filtersRow}>
        {/* Search */}
        <div className={styles.filterGroup}>
          <label>Tìm kiếm</label>
          <div style={{ position: 'relative' }}>
            <FontAwesomeIcon 
              icon={faSearch} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#6c757d',
                fontSize: '14px'
              }} 
            />
            <input
              type="text"
              className={styles.formControl}
              placeholder="Tìm theo tên, email, SĐT..."
              value={filters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className={styles.filterGroup}>
          <label>Trạng thái</label>
          <select
            className={`${styles.formControl} ${styles.select}`}
            value={filters.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.value === 'active' ? '✅' : status.value === 'inactive' ? '🔒' : '🚫'} {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className={styles.filterGroup}>
          <label>Sắp xếp theo</label>
          <select
            className={`${styles.formControl} ${styles.select}`}
            value={filters.sortBy}
            onChange={(e) => handleInputChange('sortBy', e.target.value)}
          >
            <option value="createdAt">Ngày tạo</option>
            <option value="name">Tên</option>
            <option value="email">Email</option>
          </select>
        </div>

        {/* Filter Actions */}
        <div className={styles.filterActions}>
          {hasActiveFilters && (
            <button
              className={`${styles.btn} ${styles['btn-secondary']}`}
              onClick={onClearFilters}
              title="Xóa bộ lọc"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FontAwesomeIcon icon={faTimes} />
              <span>Xóa lọc</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerFiltersComponent;
