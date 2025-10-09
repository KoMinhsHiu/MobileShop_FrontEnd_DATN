export interface ReportsSummaryCard {
  title: string;
  value: string;
  unit: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: any;
  color: string;
  bgColor: string;
}

export interface RevenueTimeData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProductData {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  stock: number;
  percentage: number;
}

export interface PaymentMethodData {
  name: string;
  value: number;
  color: string;
  count: number;
}

export interface CustomerGrowthData {
  month: string;
  newCustomers: number;
  totalCustomers: number;
}

export interface TimeFilter {
  label: string;
  value: string;
  days: number;
}

export interface ReportsData {
  summary: ReportsSummaryCard[];
  revenueTimeData: RevenueTimeData[];
  topProducts: TopProductData[];
  paymentMethods: PaymentMethodData[];
  customerGrowth: CustomerGrowthData[];
}
