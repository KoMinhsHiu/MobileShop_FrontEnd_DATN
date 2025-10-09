export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

export const formatChartValue = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export const getChartTooltipStyle = () => ({
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  padding: '12px',
  fontSize: '14px',
  color: '#374151'
});

export const getLineChartTooltipFormatter = (value: any, name: string) => {
  if (name === 'revenue') {
    return [formatCurrency(value), 'Doanh thu'];
  } else if (name === 'orders') {
    return [formatNumber(value), 'Đơn hàng'];
  }
  return [value, name];
};

export const getBarChartTooltipFormatter = (value: any, name: string) => {
  if (name === 'quantity') {
    return [formatNumber(value), 'Số lượng bán'];
  } else if (name === 'revenue') {
    return [formatCurrency(value), 'Doanh thu'];
  }
  return [value, name];
};

export const getPieChartTooltipFormatter = (value: any, name: string, props: any) => {
  const total = props.payload.total || 1;
  const percentage = ((value / total) * 100).toFixed(1);
  return [`${value} (${percentage}%)`, name];
};

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data: any[], filename: string) => {
  // This would require a library like xlsx
  // For now, we'll use CSV export as a fallback
  exportToCSV(data, filename);
};

export const getTimeFilterData = (data: any[], days: number) => {
  // Filter data based on the number of days
  // This is a simplified version - in real app, you'd filter by actual dates
  return data.slice(-days);
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100; // Round to 2 decimal places
};
