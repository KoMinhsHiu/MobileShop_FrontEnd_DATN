import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { DashboardSummaryCard } from '../admin.types';
import styles from './SummaryCard.module.scss';

interface SummaryCardProps {
  data: DashboardSummaryCard;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ data }) => {
  return (
    <div className={styles.summaryCard}>
      <div className={styles.cardHeader}>
        <div 
          className={styles.cardIcon}
          style={{ 
            color: data.color, 
            backgroundColor: data.bgColor 
          }}
        >
          <FontAwesomeIcon icon={data.icon} />
        </div>
        <div className={styles.cardChange}>
          <FontAwesomeIcon 
            icon={data.changeType === 'increase' ? faArrowUp : faArrowDown} 
            className={data.changeType === 'increase' ? styles.increase : styles.decrease}
          />
          <span className={data.changeType === 'increase' ? styles.increase : styles.decrease}>
            {data.change}
          </span>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardValue}>
          {data.value}
          <span className={styles.cardUnit}>{data.unit}</span>
        </div>
        <div className={styles.cardTitle}>{data.title}</div>
      </div>
    </div>
  );
};

export default SummaryCard;

