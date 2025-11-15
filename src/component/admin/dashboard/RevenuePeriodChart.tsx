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
import { RevenueByPeriod, RevenueDataPoint } from '@/utils/api/dashboard';
import { formatCurrency } from '../admin.utils';
import styles from './RevenuePeriodChart.module.scss';

interface RevenuePeriodChartProps {
  revenueData: RevenueByPeriod;
}

type PeriodKey = 'last7Days' | 'last30Days' | 'last3Months' | 'last6Months' | 'lastYear';

const PERIOD_OPTIONS = [
  { key: 'last7Days' as PeriodKey, label: '7 ngày qua', shortLabel: '7 ngày' },
  { key: 'last30Days' as PeriodKey, label: '30 ngày qua', shortLabel: '30 ngày' },
  { key: 'last3Months' as PeriodKey, label: '3 tháng qua', shortLabel: '3 tháng' },
  { key: 'last6Months' as PeriodKey, label: '6 tháng qua', shortLabel: '6 tháng' },
  { key: 'lastYear' as PeriodKey, label: '12 tháng qua', shortLabel: '12 tháng' }
];

const RevenuePeriodChart: React.FC<RevenuePeriodChartProps> = ({ revenueData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('last30Days');
  
  const currentData = revenueData[selectedPeriod];
  
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

  return (
    <div className={styles.revenuePeriodChart}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitle}>
          <h3>Doanh thu theo thời gian</h3>
          <p>Tổng doanh thu: <span className={styles.totalRevenue}>{formatCurrency(currentData.total)}</span></p>
        </div>
        <div className={styles.periodSelector}>
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.key}
              onClick={() => setSelectedPeriod(option.key)}
              className={`${styles.periodButton} ${selectedPeriod === option.key ? styles.active : ''}`}
            >
              <span className={styles.fullLabel}>{option.label}</span>
              <span className={styles.shortLabel}>{option.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart 
            data={currentData.data}
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
      </div>
    </div>
  );
};

export default RevenuePeriodChart;