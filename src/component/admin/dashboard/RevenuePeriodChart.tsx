import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RevenueByPeriod } from '@/utils/api/dashboard';
import { formatCurrency } from '../admin.utils';
import styles from './RevenuePeriodChart.module.scss';

interface RevenuePeriodChartProps {
  revenueData: RevenueByPeriod;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  isLoading?: boolean;
}

type PeriodKey = 'last7Days' | 'last30Days' | 'last3Months' | 'last6Months' | 'lastYear' | 'custom';

const PERIOD_OPTIONS = [
  { key: 'last7Days' as PeriodKey, label: '7 ngày qua', shortLabel: '7 ngày' },
  { key: 'last30Days' as PeriodKey, label: '30 ngày qua', shortLabel: '30 ngày' },
  { key: 'last3Months' as PeriodKey, label: '3 tháng qua', shortLabel: '3 tháng' },
  { key: 'last6Months' as PeriodKey, label: '6 tháng qua', shortLabel: '6 tháng' },
  { key: 'lastYear' as PeriodKey, label: '12 tháng qua', shortLabel: '12 tháng' },
  { key: 'custom' as PeriodKey, label: 'Tùy chọn thời gian', shortLabel: 'Tùy chọn' }
];

const getDateRangeForPeriod = (period: PeriodKey): { startDate: string; endDate: string } => {
  const endDate = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'last7Days':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'last30Days':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case 'last3Months':
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    case 'last6Months':
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case 'lastYear':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      return { startDate: '', endDate: '' };
  }
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

const RevenuePeriodChart: React.FC<RevenuePeriodChartProps> = ({ 
  revenueData, 
  onDateRangeChange,
  isLoading = false 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('last30Days');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [dateRangeError, setDateRangeError] = useState<string>('');
  
  const handlePeriodChange = (period: PeriodKey) => {
    setSelectedPeriod(period);
    setDateRangeError('');
    
    if (period !== 'custom' && onDateRangeChange) {
      const dateRange = getDateRangeForPeriod(period);
      onDateRangeChange(dateRange.startDate, dateRange.endDate);
    }
  };
  
  const handleCustomDateSubmit = () => {
    if (!customStartDate || !customEndDate) {
      setDateRangeError('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc');
      return;
    }
    
    const startDate = new Date(customStartDate);
    const endDate = new Date(customEndDate);
    const today = new Date();
    
    if (startDate >= endDate) {
      setDateRangeError('Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }
    
    if (endDate > today) {
      setDateRangeError('Ngày kết thúc không được vượt quá ngày hiện tại');
      return;
    }
    
    // Check if date range is too large (more than 3 years)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 1095) {
      setDateRangeError('Khoảng thời gian tối đa là 3 năm');
      return;
    }
    
    setDateRangeError('');
    if (onDateRangeChange) {
      onDateRangeChange(customStartDate, customEndDate);
    }
  };
  
  const formatTooltip = (value: number, name: string) => {
    if (name === 'value') {
      return [formatCurrency(value), 'Doanh thu'];
    }
    return [value, name];
  };

  const formatYAxisTick = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const customTooltipStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };
  
  const getPeriodLabel = () => {
    switch (revenueData.period) {
      case 'daily': return 'theo ngày';
      case 'weekly': return 'theo tuần';
      case 'monthly': return 'theo tháng';
      case 'quarterly': return 'theo quý';
      default: return '';
    }
  };

  return (
    <div className={styles.revenuePeriodChart}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitle}>
          <h3>Doanh thu theo thời gian</h3>
          <p>
            Tổng doanh thu: <span className={styles.totalRevenue}>{formatCurrency(revenueData.total)}</span>
          </p>
          {revenueData.period && (
            <span className={styles.periodInfo}> (Hiển thị {getPeriodLabel()})</span>
          )}
        </div>
        <div className={styles.periodSelector}>
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.key}
              onClick={() => handlePeriodChange(option.key)}
              className={`${styles.periodButton} ${selectedPeriod === option.key ? styles.active : ''}`}
              disabled={isLoading}
            >
              <span className={styles.fullLabel}>{option.label}</span>
              <span className={styles.shortLabel}>{option.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>
      
      {selectedPeriod === 'custom' && (
        <div className={styles.customDateRange}>
          <div className={styles.dateInputGroup}>
            <div className={styles.dateInput}>
              <label htmlFor="startDate">
                <FontAwesomeIcon icon={faCalendarAlt} />
                Từ ngày
              </label>
              <input
                id="startDate"
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                disabled={isLoading}
              />
            </div>
            
            <div className={styles.dateInput}>
              <label htmlFor="endDate">
                <FontAwesomeIcon icon={faCalendarAlt} />
                Đến ngày
              </label>
              <input
                id="endDate"
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                min={customStartDate}
                disabled={isLoading}
              />
            </div>
            
            <button 
              className={styles.applyButton}
              onClick={handleCustomDateSubmit}
              disabled={isLoading || !customStartDate || !customEndDate}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
                  Đang tải...
                </>
              ) : (
                'Áp dụng'
              )}
            </button>
          </div>
          
          {dateRangeError && (
            <div className={styles.errorMessage}>
              {dateRangeError}
            </div>
          )}
        </div>
      )}
      
      <div className={styles.chartContainer}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
            <p>Đang tải dữ liệu biểu đồ...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart 
              data={revenueData.data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="label" 
                stroke="#64748b"
                fontSize={12}
                tickMargin={8}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={formatYAxisTick}
                tickMargin={8}
              />
              <Tooltip 
                contentStyle={customTooltipStyle}
                formatter={formatTooltip}
                labelStyle={{ color: '#374151', fontWeight: 600 }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ 
                  fill: '#3b82f6', 
                  strokeWidth: 2, 
                  r: 4,
                  stroke: '#ffffff'
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: '#3b82f6', 
                  strokeWidth: 2,
                  fill: '#ffffff'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenuePeriodChart;