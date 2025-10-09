import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { OrderFilters, OrderStatusOption } from '../../admin.types';
import styles from '../OrderManagement.module.scss';

interface OrderFiltersProps {
  filters: OrderFilters;
  statusOptions: OrderStatusOption[];
  onFilterChange: (key: keyof OrderFilters, value: string) => void;
  onClearFilters: () => void;
}

const OrderFiltersComponent: React.FC<OrderFiltersProps> = ({
  filters,
  statusOptions,
  onFilterChange,
  onClearFilters
}) => {
  return (
    <div className={styles.filtersCard}>
      <div className={styles.filtersGrid}>
        <div className={styles.filterGroup}>
          <label htmlFor="search-input">Tìm kiếm</label>
          <input
            id="search-input"
            type="text"
            placeholder="Mã đơn hàng, tên khách hàng, SĐT..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            aria-label="Tìm kiếm đơn hàng"
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label htmlFor="status-filter">Trạng thái</label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            aria-label="Lọc theo trạng thái"
          >
            <option value="Tất cả">Tất cả</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label htmlFor="payment-filter">Thanh toán</label>
          <select
            id="payment-filter"
            value={filters.paymentMethod}
            onChange={(e) => onFilterChange('paymentMethod', e.target.value)}
            aria-label="Lọc theo phương thức thanh toán"
          >
            <option value="Tất cả">Tất cả</option>
            <option value="COD">COD</option>
            <option value="VNPay">VNPay</option>
            <option value="Momo">Momo</option>
            <option value="BankTransfer">Chuyển khoản</option>
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label htmlFor="date-from">Từ ngày</label>
          <input
            id="date-from"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange('dateFrom', e.target.value)}
            aria-label="Lọc từ ngày"
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label htmlFor="date-to">Đến ngày</label>
          <input
            id="date-to"
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange('dateTo', e.target.value)}
            aria-label="Lọc đến ngày"
          />
        </div>
      </div>
      
      <div className={styles.filterActions}>
        <button 
          className="btn btn-outline"
          onClick={onClearFilters}
          aria-label="Xóa tất cả bộ lọc"
        >
          <FontAwesomeIcon icon={faFilter} />
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};

export default OrderFiltersComponent;
