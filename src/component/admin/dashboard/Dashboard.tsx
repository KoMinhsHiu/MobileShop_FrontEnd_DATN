import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { dashboardAPI, DashboardAnalytics } from '@/utils/api/dashboard';
import RevenuePeriodChart from './RevenuePeriodChart';
import SummaryCards from './SummaryCards';
import PaymentMethodChart from './PaymentMethodChart';
import OrderStatusChart from './OrderStatusChart';
import TopSellingTable from './TopSellingTable';
import styles from './Dashboard.module.scss';

const Dashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await dashboardAPI.getDashboardAnalytics();
        setAnalyticsData(data);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message || 'Có lỗi xảy ra khi tải dữ liệu dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDateRangeChange = async (startDate: string, endDate: string) => {
    try {
      setChartLoading(true);
      const data = await dashboardAPI.getDashboardAnalytics(startDate, endDate);
      setAnalyticsData(data);
    } catch (error: any) {
      console.error('Error fetching date range data:', error);
      setError(error.message || 'Có lỗi xảy ra khi tải dữ liệu theo khoảng thời gian');
    } finally {
      setChartLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dashboardAPI.getDashboardAnalytics();
      setAnalyticsData(data);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Có lỗi xảy ra khi tải dữ liệu dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loadingContainer}>
          <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
          <p>Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button onClick={handleRefresh} className={styles.retryButton}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.noDataContainer}>
          <p>Không có dữ liệu dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h1>Dashboard</h1>
          <p>Chào mừng trở lại! Đây là tổng quan về cửa hàng của bạn.</p>
        </div>
        <div className={styles.pageActions}>
          <button onClick={handleRefresh} className={styles.refreshBtn}>
            <FontAwesomeIcon icon={faEye} />
            Làm mới dữ liệu
          </button>
        </div>
      </div>

      {/* Revenue Period Chart - Top Section */}
      <RevenuePeriodChart 
        revenueData={analyticsData.revenueByPeriod} 
        onDateRangeChange={handleDateRangeChange}
        isLoading={chartLoading}
      />

      {/* Summary Cards - 6 metrics in 2 rows */}
      <SummaryCards analyticsData={analyticsData} />

      {/* Charts Section - Payment Methods & Order Status */}
      <div className={styles.chartsGrid}>
        <PaymentMethodChart paymentMethodsData={analyticsData.paymentMethods} />
        <OrderStatusChart orderStatusData={analyticsData.orderStatuses} />
      </div>

      {/* Top Selling Products Table */}
      <TopSellingTable topProducts={analyticsData.top10BestSellingProducts} />
    </div>
  );
};

export default Dashboard;
