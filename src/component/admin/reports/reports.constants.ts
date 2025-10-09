import { 
  faDollarSign,
  faShoppingCart,
  faUsers,
  faUndo,
  faDownload,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import { 
  ReportsSummaryCard, 
  RevenueTimeData, 
  TopProductData, 
  PaymentMethodData, 
  CustomerGrowthData,
  TimeFilter,
  ReportsData
} from './reports.types';

export const TIME_FILTERS: TimeFilter[] = [
  { label: '7 ngày qua', value: '7d', days: 7 },
  { label: '30 ngày qua', value: '30d', days: 30 },
  { label: '3 tháng qua', value: '3m', days: 90 },
  { label: '6 tháng qua', value: '6m', days: 180 },
  { label: '1 năm qua', value: '1y', days: 365 }
];

export const SUMMARY_CARDS: ReportsSummaryCard[] = [
  {
    title: 'Tổng doanh thu',
    value: '125.000.000',
    unit: 'VNĐ',
    change: '+12.5%',
    changeType: 'increase',
    icon: faDollarSign,
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    title: 'Tổng đơn hàng',
    value: '230',
    unit: 'đơn',
    change: '+8.3%',
    changeType: 'increase',
    icon: faShoppingCart,
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    title: 'Khách hàng mới',
    value: '42',
    unit: 'người',
    change: '+15.7%',
    changeType: 'increase',
    icon: faUsers,
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    title: 'Tỷ lệ hoàn hàng',
    value: '2.5',
    unit: '%',
    change: '-0.8%',
    changeType: 'decrease',
    icon: faUndo,
    color: '#f59e0b',
    bgColor: '#fef3c7'
  }
];

export const REVENUE_TIME_DATA: RevenueTimeData[] = [
  { date: '01/01', revenue: 4500000, orders: 12 },
  { date: '02/01', revenue: 5200000, orders: 15 },
  { date: '03/01', revenue: 3800000, orders: 11 },
  { date: '04/01', revenue: 6100000, orders: 18 },
  { date: '05/01', revenue: 4800000, orders: 14 },
  { date: '06/01', revenue: 7200000, orders: 21 },
  { date: '07/01', revenue: 5500000, orders: 16 },
  { date: '08/01', revenue: 6800000, orders: 19 },
  { date: '09/01', revenue: 4900000, orders: 13 },
  { date: '10/01', revenue: 6300000, orders: 17 },
  { date: '11/01', revenue: 5700000, orders: 15 },
  { date: '12/01', revenue: 7100000, orders: 20 },
  { date: '13/01', revenue: 4600000, orders: 12 },
  { date: '14/01', revenue: 5900000, orders: 16 }
];

export const TOP_PRODUCTS_DATA: TopProductData[] = [
  {
    id: 'SP001',
    name: 'iPhone 15 Pro Max 256GB',
    quantity: 120,
    revenue: 2880000000,
    stock: 20,
    percentage: 22.5
  },
  {
    id: 'SP002',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    quantity: 85,
    revenue: 1700000000,
    stock: 15,
    percentage: 15.8
  },
  {
    id: 'SP003',
    name: 'iPhone 14 Pro 128GB',
    quantity: 95,
    revenue: 1900000000,
    stock: 25,
    percentage: 18.2
  },
  {
    id: 'SP004',
    name: 'Samsung Galaxy S23+ 256GB',
    quantity: 78,
    revenue: 1560000000,
    stock: 18,
    percentage: 14.6
  },
  {
    id: 'SP005',
    name: 'iPhone 13 128GB',
    quantity: 65,
    revenue: 1300000000,
    stock: 30,
    percentage: 12.1
  },
  {
    id: 'SP006',
    name: 'Xiaomi 14 Pro 256GB',
    quantity: 52,
    revenue: 1040000000,
    stock: 12,
    percentage: 9.7
  },
  {
    id: 'SP007',
    name: 'OnePlus 12 256GB',
    quantity: 45,
    revenue: 900000000,
    stock: 8,
    percentage: 8.4
  },
  {
    id: 'SP008',
    name: 'Google Pixel 8 Pro 128GB',
    quantity: 38,
    revenue: 760000000,
    stock: 10,
    percentage: 7.1
  }
];

export const PAYMENT_METHODS_DATA: PaymentMethodData[] = [
  {
    name: 'COD',
    value: 45,
    color: '#3b82f6',
    count: 103
  },
  {
    name: 'VNPay',
    value: 30,
    color: '#10b981',
    count: 69
  },
  {
    name: 'Momo',
    value: 15,
    color: '#f59e0b',
    count: 34
  },
  {
    name: 'PayPal',
    value: 10,
    color: '#8b5cf6',
    count: 23
  }
];

export const CUSTOMER_GROWTH_DATA: CustomerGrowthData[] = [
  { month: 'Th1', newCustomers: 45, totalCustomers: 1200 },
  { month: 'Th2', newCustomers: 52, totalCustomers: 1252 },
  { month: 'Th3', newCustomers: 38, totalCustomers: 1290 },
  { month: 'Th4', newCustomers: 61, totalCustomers: 1351 },
  { month: 'Th5', newCustomers: 48, totalCustomers: 1399 },
  { month: 'Th6', newCustomers: 72, totalCustomers: 1471 },
  { month: 'Th7', newCustomers: 55, totalCustomers: 1526 }
];

export const REPORTS_DATA: ReportsData = {
  summary: SUMMARY_CARDS,
  revenueTimeData: REVENUE_TIME_DATA,
  topProducts: TOP_PRODUCTS_DATA,
  paymentMethods: PAYMENT_METHODS_DATA,
  customerGrowth: CUSTOMER_GROWTH_DATA
};
