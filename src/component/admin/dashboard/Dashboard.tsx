import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowUp,
  faArrowDown,
  faEye,
  faChartLine,
  faUsers,
  faShoppingCart,
  faBox
} from '@fortawesome/free-solid-svg-icons';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { SUMMARY_DATA, REVENUE_DATA, ORDER_STATUS_DATA, RECENT_ORDERS } from '../admin.constants';
import { 
  formatCurrency, 
  getStatusConfig, 
  formatChartValue,
  getChartTooltipStyle,
  getPieChartTooltipFormatter,
  getLineChartTooltipFormatter
} from '../admin.utils';
import SummaryCard from './SummaryCard';
import styles from './Dashboard.module.scss';

const Dashboard: React.FC = () => {
  const getStatusBadge = (status: string) => {
    const config = getStatusConfig(status as any);
    return (
      <span 
        className={styles.statusBadge}
        style={{ 
          color: config.color, 
          backgroundColor: config.bgColor 
        }}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className={styles.dashboard}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h1>Dashboard</h1>
          <p>Chào mừng trở lại! Đây là tổng quan về cửa hàng của bạn.</p>
        </div>
        <div className={styles.pageActions}>
          <button className={styles.exportBtn}>
            <FontAwesomeIcon icon={faEye} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        {SUMMARY_DATA.map((item, index) => (
          <SummaryCard key={index} data={item} />
        ))}
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        {/* Revenue Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Doanh thu theo tháng</h3>
            <p>Biểu đồ doanh thu 7 tháng gần đây</p>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
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

        {/* Order Status Pie Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Trạng thái đơn hàng</h3>
            <p>Phân bố trạng thái đơn hàng hiện tại</p>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                    data={ORDER_STATUS_DATA as any}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ORDER_STATUS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                <Tooltip 
                  contentStyle={getChartTooltipStyle()}
                  formatter={getPieChartTooltipFormatter}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.pieLegend}>
              {ORDER_STATUS_DATA.map((item, index) => (
                <div key={index} className={styles.legendItem}>
                  <div 
                    className={styles.legendColor} 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className={styles.legendContent}>
                    <span className={styles.legendLabel}>{item.name}</span>
                    <span className={styles.legendValue}>{item.value}% ({item.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>
            <h3>Đơn hàng gần đây</h3>
            <p>Danh sách 5 đơn hàng mới nhất</p>
          </div>
          <button className={styles.viewAllBtn}>
            <FontAwesomeIcon icon={faEye} />
            Xem tất cả đơn hàng
          </button>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Khách hàng</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order, index) => (
                <tr key={index}>
                  <td className={styles.orderId}>{order.id}</td>
                  <td className={styles.customerName}>{order.customer}</td>
                  <td className={styles.itemCount}>{order.items} sản phẩm</td>
                  <td className={styles.amount}>{order.amount} VNĐ</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td className={styles.date}>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
