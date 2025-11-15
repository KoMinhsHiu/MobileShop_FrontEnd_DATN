import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from 'recharts';
import { PaymentMethodStats } from '@/utils/api/dashboard';
import styles from './PaymentMethodChart.module.scss';

interface PaymentMethodChartProps {
  paymentMethodsData: PaymentMethodStats;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
  [key: string]: any;
}

const PAYMENT_METHOD_COLORS = [
  '#22c55e', // Bright Green
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#f97316', // Orange
];

const PAYMENT_METHOD_LABELS: { [key: string]: string } = {
  'VNPAY': 'VNPay',
  'COD': 'Thanh toán khi nhận hàng',
  'MOMO': 'Ví MoMo',
  'ZALOPAY': 'ZaloPay',
  'BANK_TRANSFER': 'Chuyển khoản ngân hàng',
  'CREDIT_CARD': 'Thẻ tín dụng',
  'NONE': 'Chưa thanh toán'
};

const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({ paymentMethodsData }) => {
  const totalOrders = Object.values(paymentMethodsData).reduce((sum, count) => sum + count, 0);
  
  const chartData: ChartData[] = Object.entries(paymentMethodsData)
    .map(([method, count], index) => ({
      name: PAYMENT_METHOD_LABELS[method] || method,
      value: count,
      color: PAYMENT_METHOD_COLORS[index % PAYMENT_METHOD_COLORS.length],
      percentage: totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0
    }))
    .sort((a, b) => b.value - a.value); // Sort by value descending

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles.tooltip}>
          <div className={styles.tooltipLabel}>{data.name}</div>
          <div className={styles.tooltipValue}>
            <span className={styles.tooltipCount}>{data.value} đơn hàng</span>
            <span className={styles.tooltipPercentage}>({data.percentage}%)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    if (percentage < 5) return null; // Hide labels for small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
      >
        {`${percentage}%`}
      </text>
    );
  };

  if (totalOrders === 0) {
    return (
      <div className={styles.paymentMethodChart}>
        <div className={styles.chartHeader}>
          <h3>Phương thức thanh toán</h3>
          <p>Phân bố phương thức thanh toán</p>
        </div>
        <div className={styles.noDataContainer}>
          <p className={styles.noDataText}>Chưa có dữ liệu đơn hàng</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.paymentMethodChart}>
      <div className={styles.chartHeader}>
        <h3>Phương thức thanh toán</h3>
        <p>Phân bố phương thức thanh toán ({totalOrders} đơn hàng)</p>
      </div>
      
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              innerRadius={40}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
          </PieChart>
        </ResponsiveContainer>
        
        <div className={styles.legend}>
          {chartData.map((item, index) => (
            <div key={index} className={styles.legendItem}>
              <div 
                className={styles.legendColor} 
                style={{ backgroundColor: item.color }}
              />
              <div className={styles.legendContent}>
                <span className={styles.legendLabel}>{item.name}</span>
                <span className={styles.legendValue}>
                  {item.value} đơn ({item.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodChart;