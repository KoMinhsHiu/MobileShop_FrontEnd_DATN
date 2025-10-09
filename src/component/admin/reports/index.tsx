import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDownload,
  faFilter,
  faArrowUp,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  REPORTS_DATA, 
  TIME_FILTERS 
} from './reports.constants';
import { 
  formatCurrency, 
  formatNumber,
  formatChartValue,
  getChartTooltipStyle,
  getLineChartTooltipFormatter,
  getBarChartTooltipFormatter,
  getPieChartTooltipFormatter,
  exportToCSV
} from './reports.utils';
import styles from './reports.module.scss';

const Reports: React.FC = () => {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('30d');
  const [filteredData, setFilteredData] = useState(REPORTS_DATA);

  const handleTimeFilterChange = (value: string) => {
    setSelectedTimeFilter(value);
    // In a real app, you would filter data based on the selected time period
    // For now, we'll use the same data
    setFilteredData(REPORTS_DATA);
  };

  const handleExportCSV = () => {
    const exportData = filteredData.topProducts.map(product => ({
      'Mã SP': product.id,
      'Tên sản phẩm': product.name,
      'Số lượng bán': product.quantity,
      'Doanh thu': formatCurrency(product.revenue),
      'Tồn kho': product.stock,
      'Tỷ trọng (%)': `${product.percentage}%`
    }));
    exportToCSV(exportData, 'thong-ke-san-pham');
  };

  const SummaryCard: React.FC<{ data: any }> = ({ data }) => (
    <div className={styles.summaryCard}>
      <div className={styles.cardHeader}>
        <div 
          className={styles.cardIcon}
          style={{ 
            backgroundColor: data.bgColor,
            color: data.color 
          }}
        >
          <FontAwesomeIcon icon={data.icon} />
        </div>
        <div className={`${styles.changeIndicator} ${styles[data.changeType]}`}>
          <FontAwesomeIcon 
            icon={data.changeType === 'increase' ? faArrowUp : faArrowDown} 
          />
          {data.change}
        </div>
      </div>
      <div className={styles.cardContent}>
        <h4 className={styles.cardTitle}>{data.title}</h4>
        <p className={styles.cardValue}>{data.value}</p>
        <p className={styles.cardUnit}>{data.unit}</p>
      </div>
    </div>
  );

  return (
    <div className={styles.reports}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h1>Thống kê doanh thu</h1>
          <p>Báo cáo chi tiết về doanh thu và hiệu suất bán hàng</p>
        </div>
        <div className={styles.pageActions}>
          <div className={styles.timeFilter}>
            <FontAwesomeIcon icon={faFilter} />
            <select 
              value={selectedTimeFilter}
              onChange={(e) => handleTimeFilterChange(e.target.value)}
            >
              {TIME_FILTERS.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
          <button className={styles.exportBtn}>
            <FontAwesomeIcon icon={faDownload} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        {filteredData.summary.map((card, index) => (
          <SummaryCard key={index} data={card} />
        ))}
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        {/* Revenue Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Doanh thu theo thời gian</h3>
            <p>Biểu đồ doanh thu theo ngày trong kỳ được chọn</p>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData.revenueTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={formatChartValue}
                />
                <Tooltip 
                  contentStyle={getChartTooltipStyle()}
                  formatter={getLineChartTooltipFormatter}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Pie Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Tỷ lệ thanh toán</h3>
            <p>Phân bố phương thức thanh toán</p>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={filteredData.paymentMethods}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {filteredData.paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={getChartTooltipStyle()}
                  formatter={getPieChartTooltipFormatter}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className={styles.additionalCharts}>
        {/* Top Products Bar Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Sản phẩm bán chạy</h3>
            <p>Top 8 sản phẩm có doanh thu cao nhất</p>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData.topProducts.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={formatChartValue}
                />
                <Tooltip 
                  contentStyle={getChartTooltipStyle()}
                  formatter={getBarChartTooltipFormatter}
                />
                <Bar 
                  dataKey="quantity" 
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Growth Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Tăng trưởng khách hàng</h3>
            <p>Khách hàng mới theo tháng</p>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData.customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={getChartTooltipStyle()}
                  formatter={(value, name) => {
                    if (name === 'newCustomers') {
                      return [formatNumber(value), 'Khách hàng mới'];
                    } else if (name === 'totalCustomers') {
                      return [formatNumber(value), 'Tổng khách hàng'];
                    }
                    return [value, name];
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="newCustomers" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Statistics Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>
            <h3>Chi tiết thống kê sản phẩm</h3>
            <p>Bảng thống kê chi tiết về doanh thu và số lượng bán của từng sản phẩm</p>
          </div>
          <div className={styles.tableActions}>
            <button className={styles.exportBtn} onClick={handleExportCSV}>
              <FontAwesomeIcon icon={faDownload} />
              Xuất CSV
            </button>
          </div>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã SP</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng bán</th>
                <th>Doanh thu</th>
                <th>Tồn kho</th>
                <th>Tỷ trọng (%)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.topProducts.map((product, index) => (
                <tr key={index}>
                  <td className={styles.productId}>{product.id}</td>
                  <td className={styles.productName}>{product.name}</td>
                  <td className={styles.quantity}>{formatNumber(product.quantity)}</td>
                  <td className={styles.revenue}>{formatCurrency(product.revenue)}</td>
                  <td className={styles.stock}>{formatNumber(product.stock)}</td>
                  <td className={styles.percentage}>{product.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
