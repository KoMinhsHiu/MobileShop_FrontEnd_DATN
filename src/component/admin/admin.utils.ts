import { OrderStatus } from './admin.types';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value);
};

export const getStatusConfig = (status: OrderStatus) => {
  const statusConfig = {
    pending: { label: 'Chờ xác nhận', color: '#f59e0b', bgColor: '#fef3c7' },
    shipping: { label: 'Đang giao', color: '#3b82f6', bgColor: '#dbeafe' },
    completed: { label: 'Hoàn tất', color: '#10b981', bgColor: '#d1fae5' },
    cancelled: { label: 'Hủy', color: '#ef4444', bgColor: '#fee2e2' }
  };

  return statusConfig[status];
};

export const formatChartValue = (value: number): string => {
  return `${(value / 1000000000).toFixed(1)}B`;
};

export const getChartTooltipStyle = () => ({
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '0.75rem',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  fontSize: '0.875rem'
});

export const getPieChartTooltipFormatter = (value: number, name: string, props: any) => [
  `${value}% (${props.payload.count} đơn)`,
  name
];

export const getLineChartTooltipFormatter = (value: number) => [
  formatCurrency(value), 
  'Doanh thu'
];

