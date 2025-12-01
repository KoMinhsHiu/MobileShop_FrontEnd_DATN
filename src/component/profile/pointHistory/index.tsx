import type { PointHistory } from "@/utils/type/profile";
import { formatCurrency } from '@/component/admin/admin.utils';
import { formatDateTime } from '@/utils/function/ordersUtils';
import styles from './PointHistory.module.scss';

interface PointHistoryProps {
  pointHistory: PointHistory[];
  pointsBalance: number;
  
}

const PointHistory: React.FC<PointHistoryProps> = ({
    pointHistory,
    pointsBalance
}) => {
    const getTransactionConfig = (type: string) => {
        switch (type) {
            case 'earn':
                return { label: 'Tích điểm', className: styles.typeEarn, sign: '+' };
            case 'redeem':
                return { label: 'Đổi điểm', className: styles.typeRedeem, sign: '-' };
            case 'refund':
                return { label: 'Hoàn trả', className: styles.typeRefund, sign: '+' };
            default:
                return { label: type, className: '', sign: '' };
        }
    };

    return (
        <div className={styles.pointHistoryContainer}>
            {/* Phần hiển thị tổng điểm */}
            <div className={styles.balanceCard}>
                <div className={styles.balanceInfo}>
                    <h3>Điểm tích lũy hiện có</h3>
                    <div className={styles.points}>
                        {pointsBalance.toLocaleString('vi-VN')} <span>điểm</span>
                    </div>
                </div>
                <div className={styles.cardIcon}>
                    💎
                </div>
            </div>

            {/* Bảng lịch sử */}
            <div className={styles.historySection}>
                <h3>Lịch sử giao dịch</h3>
                
                {pointHistory && pointHistory.length > 0 ? (
                    <div className={styles.tableWrapper}>
                        <table className={styles.historyTable}>
                            <thead>
                                <tr>
                                    <th>Thời gian</th>
                                    <th>Mã đơn hàng</th>
                                    <th>Loại giao dịch</th>
                                    <th className="text-right">Giá trị (VND)</th>
                                    <th className="text-right">Số điểm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pointHistory.map((item) => {
                                    const config = getTransactionConfig(item.type);
                                    return (
                                        <tr key={item.id}>
                                            <td className={styles.dateCol}>{formatDateTime(item.createdAt)}</td>
                                            <td className={styles.orderCol}>{item.orderCode}</td>
                                            <td>
                                                <span className={`${styles.badge} ${config.className}`}>
                                                    {config.label}
                                                </span>
                                            </td>
                                            <td className={styles.moneyCol}>
                                                {formatCurrency(item.moneyValue)}
                                            </td>
                                            <td className={`${styles.pointCol} ${config.className}`}>
                                                {config.sign}{item.points.toLocaleString('vi-VN')}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p>Bạn chưa có lịch sử tích điểm nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PointHistory;