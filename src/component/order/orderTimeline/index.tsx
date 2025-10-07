import React from "react";
import { timelineSteps } from "@/pages/orders/mockData";
import { getCurrentStepIndex } from "@/pages/orders/utils";

import styles from "./orderTimeline.module.scss";

interface OrderTimelineProps {
  status: string;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  const currentStepIndex = getCurrentStepIndex(status);

  return (
    <div className={styles.orderTimeline}>
      <h3>Trạng thái đơn hàng</h3>
      <div className={styles.timeline}>
        {timelineSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <div key={step.key} className={`${styles.timelineStep} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''}`}>
              <div className={styles.timelineIcon}>
                <span className={styles.stepIcon}>{step.icon}</span>
              </div>
              <div className={styles.timelineContent}>
                <h4 className={styles.stepTitle}>{step.label}</h4>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
