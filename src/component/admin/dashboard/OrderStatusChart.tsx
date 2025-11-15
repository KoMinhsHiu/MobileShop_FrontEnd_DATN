import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { OrderStatusStats } from '@/utils/api/dashboard';
import styles from './OrderStatusChart.module.scss';

interface OrderStatusChartProps {
  orderStatusData: OrderStatusStats;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
  [key: string]: any;
}

const ORDER_STATUS_COLORS = [
  '#22c55e', // Bright Green for delivered
  '#3b82f6', // Blue for paid
  '#f59e0b', // Amber for pending
  '#8b5cf6', // Purple for processing
  '#06b6d4', // Cyan for shipped
  '#ef4444', // Red for cancelled
  '#64748b', // Gray for failed
  '#ec4899', // Pink for other statuses
];

const ORDER_STATUS_LABELS: { [key: string]: string } = {
  'pending': 'Chờ xử lý',
  'paid': 'Đã thanh toán',
  'processing': 'Đang xử lý',
  'shipped': 'Đang giao hàng',
  'delivered': 'Đã giao hàng',
  'canceled': 'Đã hủy',
  'failed': 'Thất bại'
};

const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ orderStatusData }) => {
  const totalOrders = Object.values(orderStatusData).reduce((sum, count) => sum + count, 0);
  
  const chartData: ChartData[] = Object.entries(orderStatusData)
    .map(([status, count], index) => ({
      name: ORDER_STATUS_LABELS[status] || status,
      value: count,
      color: ORDER_STATUS_COLORS[index % ORDER_STATUS_COLORS.length],
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
    if (percentage < 8) return null; // Hide labels for small slices
    
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
      <div className={styles.orderStatusChart}>
        <div className={styles.chartHeader}>
          <h3>Trạng thái đơn hàng</h3>
          <p>Phân bố trạng thái đơn hàng</p>
        </div>
        <div className={styles.noDataContainer}>
          <p className={styles.noDataText}>Chưa có dữ liệu đơn hàng</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.orderStatusChart}>
      <div className={styles.chartHeader}>
        <h3>Trạng thái đơn hàng</h3>
        <p>Phân bố trạng thái đơn hàng ({totalOrders} đơn hàng)</p>
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

export default OrderStatusChart;