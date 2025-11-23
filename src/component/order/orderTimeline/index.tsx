
import React from "react";
import styles from "./orderTimeline.module.scss";
import { StatusHistory } from '@/utils/api/orders';

interface OrderTimelineProps {
  statusHistory: StatusHistory[];
}


const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const OrderTimeline: React.FC<OrderTimelineProps> = ({ statusHistory }) => {
  return (
    <div className={styles.orderTimeline}>
      <h3>Trạng thái đơn hàng</h3>
      <div className={styles.timeline}>
        {statusHistory.map((item, idx) => (
          <div key={idx} className={styles.timelineStep}>
            <div className={styles.timelineIcon}>
              <span className={styles.stepIcon}>•</span>
            </div>
            <div className={styles.timelineContent}>
              <h4 className={styles.stepTitle}>{item.status}</h4>
              {item.note && <p className={styles.stepNote}>{item.note}</p>}
              <p className={styles.stepDate}>{formatDate(item.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTimeline;
