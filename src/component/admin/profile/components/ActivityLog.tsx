import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import { ActivityLogProps } from '../adminProfile.types';
import styles from '../AdminProfile.module.scss';

const ActivityLog: React.FC<ActivityLogProps> = ({ logs, isLoading }) => {
  if (isLoading) {
    return (
      <div className={styles.activityLog}>
        <div className={styles.section}>
          <h2>Nhật ký hoạt động</h2>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Đang tải nhật ký hoạt động...</p>
          </div>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className={styles.activityLog}>
        <div className={styles.section}>
          <h2>Nhật ký hoạt động</h2>
          <div className={styles.emptyState}>
            <FontAwesomeIcon icon={faHistory} className={styles.emptyIcon} />
            <p>Chưa có hoạt động nào được ghi nhận</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.activityLog}>
      <div className={styles.section}>
        <h2>Nhật ký hoạt động</h2>
        <p className={styles.sectionDescription}>
          Theo dõi các hoạt động gần đây và lịch sử đăng nhập
        </p>
        
        <div className={styles.activityList}>
          {logs.map((log) => (
            <div key={log.id} className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <FontAwesomeIcon icon={faHistory} />
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityHeader}>
                  <h4>{log.action}</h4>
                  <span className={styles.activityTime}>{log.timestamp}</span>
                </div>
                <p className={styles.activityDescription}>{log.description}</p>
                <div className={styles.activityMeta}>
                  <span>IP: {log.ipAddress}</span>
                  <span>Browser: {log.userAgent}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
