import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox, 
  faShoppingCart, 
  faChartLine, 
  faUsers,
  faCalendarAlt,
  faDollarSign
} from '@fortawesome/free-solid-svg-icons';
import { DashboardAnalytics } from '@/utils/api/dashboard';
import { formatCurrency } from '../admin.utils';
import styles from './SummaryCards.module.scss';

interface SummaryCardsProps {
  analyticsData: DashboardAnalytics;
}

interface SummaryCardData {
  id: string;
  title: string;
  value: string;
  unit?: string;
  icon: any;
  color: string;
  bgColor: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ analyticsData }) => {
  const summaryData: SummaryCardData[] = [
    // First row
    {
      id: 'totalProducts',
      title: 'Tổng sản phẩm',
      value: analyticsData.totalProducts.toLocaleString(),
      icon: faBox,
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      id: 'totalOrders',
      title: 'Tổng đơn hàng',
      value: analyticsData.totalOrders.toLocaleString(),
      icon: faShoppingCart,
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    {
      id: 'totalRevenue',
      title: 'Tổng doanh thu',
      value: formatCurrency(analyticsData.totalRevenue),
      icon: faChartLine,
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    },
    // Second row
    {
      id: 'totalCustomers',
      title: 'Tổng khách hàng',
      value: analyticsData.totalCustomers.toLocaleString(),
      icon: faUsers,
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      id: 'thisMonthOrders',
      title: 'Đơn hàng tháng này',
      value: analyticsData.thisMonthOrders.toLocaleString(),
      icon: faCalendarAlt,
      color: '#ef4444',
      bgColor: '#fecaca'
    },
    {
      id: 'thisMonthRevenue',
      title: 'Doanh thu tháng này',
      value: formatCurrency(analyticsData.thisMonthRevenue),
      icon: faDollarSign,
      color: '#06b6d4',
      bgColor: '#cffafe'
    }
  ];

  return (
    <div className={styles.summaryCards}>
      <div className={styles.cardsGrid}>
        {summaryData.map((card, index) => (
          <div key={card.id} className={styles.summaryCard}>
            <div className={styles.cardHeader}>
              <div 
                className={styles.cardIcon}
                style={{ 
                  color: card.color, 
                  backgroundColor: card.bgColor 
                }}
              >
                <FontAwesomeIcon icon={card.icon} />
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardValue}>
                {card.value}
                {card.unit && <span className={styles.cardUnit}>{card.unit}</span>}
              </div>
              <div className={styles.cardTitle}>{card.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCards;