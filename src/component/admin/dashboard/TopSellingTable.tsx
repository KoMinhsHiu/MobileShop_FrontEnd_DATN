import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSort, 
  faSortUp, 
  faSortDown, 
  faTrophy,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { BestSellingProduct } from '@/utils/api/dashboard';
import { formatCurrency } from '../admin.utils';
import styles from './TopSellingTable.module.scss';
import { useRouter } from 'next/router';

interface TopSellingTableProps {
  topProducts: BestSellingProduct[];
}

type SortKey = 'variantName' | 'totalSoldQuantity' | 'revenue';
type SortOrder = 'asc' | 'desc';

const TopSellingTable: React.FC<TopSellingTableProps> = ({ topProducts }) => {
  const [sortKey, setSortKey] = useState<SortKey>('totalSoldQuantity');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const router = useRouter();
  
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sortedProducts = [...topProducts].sort((a, b) => {
    let aValue: number | string = a[sortKey];
    let bValue: number | string = b[sortKey];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return faSort;
    }
    return sortOrder === 'asc' ? faSortUp : faSortDown;
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return { icon: faTrophy, color: '#f59e0b' }; // Gold
    if (index === 1) return { icon: faTrophy, color: '#6b7280' }; // Silver
    if (index === 2) return { icon: faTrophy, color: '#92400e' }; // Bronze
    return { icon: null, color: '#64748b' };
  };

  if (topProducts.length === 0) {
    return (
      <div className={styles.topSellingTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>
            <h3>Sản phẩm bán chạy nhất</h3>
            <p>Top 10 sản phẩm có doanh số cao nhất</p>
          </div>
        </div>
        <div className={styles.noDataContainer}>
          <p className={styles.noDataText}>Chưa có dữ liệu bán hàng</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.topSellingTable}>
      <div className={styles.tableHeader}>
        <div className={styles.tableTitle}>
          <h3>Sản phẩm bán chạy nhất</h3>
          <p>Top 10 sản phẩm có doanh số cao nhất</p>
        </div>
        <button
          className={styles.viewAllBtn}
          onClick={() => router.push('/admin/phones')}
        >
          <FontAwesomeIcon icon={faEye} />
          <span className={styles.btnText}>Xem tất cả sản phẩm</span>
          <span className={styles.btnTextShort}>Xem tất cả</span>
        </button>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.rankColumn}>Hạng</th>
              <th className={styles.productColumn}>
                <button 
                  className={styles.sortButton}
                  onClick={() => handleSort('variantName')}
                >
                  Sản phẩm
                  <FontAwesomeIcon icon={getSortIcon('variantName')} />
                </button>
              </th>
              <th className={styles.quantityColumn}>
                <button 
                  className={styles.sortButton}
                  onClick={() => handleSort('totalSoldQuantity')}
                >
                  Số lượng bán
                  <FontAwesomeIcon icon={getSortIcon('totalSoldQuantity')} />
                </button>
              </th>
              <th className={styles.revenueColumn}>
                <button 
                  className={styles.sortButton}
                  onClick={() => handleSort('revenue')}
                >
                  Doanh thu
                  <FontAwesomeIcon icon={getSortIcon('revenue')} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product, index) => {
              const rank = getRankIcon(index);
              return (
                <tr key={`${product.variantName}-${index}`} className={styles.productRow}>
                  <td className={styles.rankCell}>
                    <div className={styles.rankContent}>
                      {rank.icon ? (
                        <FontAwesomeIcon 
                          icon={rank.icon} 
                          style={{ color: rank.color }} 
                          className={styles.rankIcon}
                        />
                      ) : (
                        <span className={styles.rankNumber}>{index + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className={styles.productCell}>
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>{product.variantName}</span>
                    </div>
                  </td>
                  <td className={styles.quantityCell}>
                    <span className={styles.quantity}>
                      {product.totalSoldQuantity.toLocaleString()}
                    </span>
                    <span className={styles.unit}>sản phẩm</span>
                  </td>
                  <td className={styles.revenueCell}>
                    <span className={styles.revenue}>
                      {formatCurrency(product.revenue)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingTable;