import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faCheck, 
  faCheckSquare, 
  faSquare,
  faEnvelopeOpen,
  faInbox,
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons';
import { useAdminContext } from '@/context/adminContext';
import { useToast } from '@/component/common/ToastContainer';
import { Notification } from '@/utils/api/notification';
import styles from '../AdminProfile.module.scss';

const NotificationInfo: React.FC = () => {
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);
  const { showSuccess, showError, ToastContainer } = useToast();

  const {
    notifications,
    unreadNotifications,
    loadingNotifications,
    notificationError,
    markNotificationsAsRead,
    refreshNotifications
  } = useAdminContext();

  const allNotifications = useMemo(() => {
    const uniqueMap = new Map();
    
    if (Array.isArray(unreadNotifications)) {
      unreadNotifications.forEach(n => uniqueMap.set(n.id, n));
    }
    
    if (Array.isArray(notifications)) {
      notifications.forEach(n => uniqueMap.set(n.id, n));
    }

    return Array.from(uniqueMap.values());
  }, [notifications, unreadNotifications]);

  const stats = useMemo(() => {
    const total = allNotifications.length;
    const unread = allNotifications.filter(n => !n.isRead).length;
    const read = total - unread;
    return { total, unread, read };
  }, [allNotifications]);

  const sortedNotifications = useMemo(() => {
    return [...allNotifications].sort((a, b) => {
      // Unread notifications first
      if (!a.isRead && b.isRead) return -1;
      if (a.isRead && !b.isRead) return 1;
      
      // Then sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [allNotifications]);

  // Check if all notifications are selected based on the MERGED list
  const allSelected = allNotifications.length > 0 && selectedNotifications.length === allNotifications.length;
  const someSelected = selectedNotifications.length > 0 && selectedNotifications.length < allNotifications.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(allNotifications.map(n => n.id));
    }
  };

  const handleSelectNotification = (notificationId: number) => {
    setSelectedNotifications(prev => {
      if (prev.includes(notificationId)) {
        return prev.filter(id => id !== notificationId);
      } else {
        return [...prev, notificationId];
      }
    });
  };

  const handleMarkAsRead = async () => {
    if (selectedNotifications.length === 0) {
      showError('Vui lòng chọn ít nhất một thông báo để đánh dấu đã đọc');
      return;
    }

    // Filter only unread notifications
    const unreadSelectedNotifications = selectedNotifications.filter(id => {
      const notification = allNotifications.find(n => n.id === id);
      return notification && !notification.isRead;
    });

    if (unreadSelectedNotifications.length === 0) {
      showError('Tất cả thông báo đã chọn đều đã được đọc');
      return;
    }

    try {
      setIsMarkingAsRead(true);
      await markNotificationsAsRead(unreadSelectedNotifications);
      setSelectedNotifications([]);
      showSuccess(`Đã đánh dấu ${unreadSelectedNotifications.length} thông báo là đã đọc`);
    } catch (error: any) {
      showError(error.message || 'Có lỗi xảy ra khi đánh dấu thông báo');
    } finally {
      setIsMarkingAsRead(false);
    }
  };

  const formatDateTime = (dateString: string, label: string) => {
    const date = new Date(dateString);
    return (
      <span className={styles.notificationDateTime}>
        <span className={styles.dateLabel}>{label}:</span>
        <span className={styles.dateValue}>
          {date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </span>
    );
  };

  const renderNotificationItem = (notification: Notification) => {
    const isSelected = selectedNotifications.includes(notification.id);
    const isUnread = !notification.isRead;

    return (
      <div
        key={notification.id}
        className={`${styles.notificationItem} ${
          isUnread ? styles.unreadNotification : styles.readNotification
        } ${isSelected ? styles.selectedNotification : ''}`}
      >
        <div className={styles.notificationCheckbox}>
          <button
            className={styles.checkboxBtn}
            onClick={() => handleSelectNotification(notification.id)}
          >
            <FontAwesomeIcon
              icon={isSelected ? faCheckSquare : faSquare}
              className={isSelected ? styles.checkedIcon : styles.uncheckedIcon}
            />
          </button>
        </div>

        <div className={styles.notificationContent}>
          <div className={styles.notificationHeader}>
            <h4 className={styles.notificationTitle}>
              {isUnread && <span className={styles.unreadIndicator}>●</span>}
              {notification.title}
            </h4>
            <div className={styles.notificationStatus}>
              {isUnread ? (
                <span className={styles.statusBadge}>
                  <FontAwesomeIcon icon={faEnvelopeOpen} />
                  Chưa đọc
                </span>
              ) : (
                <span className={`${styles.statusBadge} ${styles.readStatus}`}>
                  <FontAwesomeIcon icon={faCheck} />
                  Đã đọc
                </span>
              )}
            </div>
          </div>

          <p className={styles.notificationMessage}>{notification.message}</p>

          <div className={styles.notificationMeta}>
            {formatDateTime(notification.createdAt, 'Tạo')}
            {!isUnread && notification.readAt && (
              <>
                <span className={styles.separator}>•</span>
                {formatDateTime(notification.readAt, 'Đọc')}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loadingNotifications) {
    return (
      <div className={styles.notificationInfo}>
        <div className={styles.section}>
          <h2>Thông báo</h2>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
            <p>Đang tải thông báo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notificationError) {
    return (
      <div className={styles.notificationInfo}>
        <div className={styles.section}>
          <h2>Thông báo</h2>
          <div className={styles.errorMessage}>
            <p>❌ {notificationError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.notificationInfo}>
      <div className={styles.section}>
        <h2>Quản lý thông báo</h2>

        {/* Control Bar */}
        <div className={styles.notificationControls}>
          <div className={styles.selectControls}>
            <button
              className={styles.selectAllBtn}
              onClick={handleSelectAll}
            >
              <FontAwesomeIcon
                icon={allSelected || someSelected ? faCheckSquare : faSquare}
                className={allSelected || someSelected ? styles.checkedIcon : styles.uncheckedIcon}
              />
              {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </button>
            {selectedNotifications.length > 0 && (
              <span className={styles.selectedCount}>
                Đã chọn {selectedNotifications.length} thông báo
              </span>
            )}
          </div>

          <div className={styles.actionControls}>
            <button
              className={styles.refreshBtn}
              onClick={refreshNotifications}
              disabled={loadingNotifications}
            >
              🔄 Làm mới
            </button>
            <button
              className={styles.markReadBtn}
              onClick={handleMarkAsRead}
              disabled={selectedNotifications.length === 0 || isMarkingAsRead}
            >
              <FontAwesomeIcon icon={faCheck} />
              {isMarkingAsRead ? 'Đang xử lý...' : 'Đánh dấu đã đọc'}
            </button>
          </div>
        </div>

        {/* Notification Stats */}
        <div className={styles.notificationStats}>
          <div className={styles.statItem}>
            <FontAwesomeIcon icon={faBell} />
            <span>Tổng: {stats.total}</span>
          </div>
          <div className={styles.statItem}>
            <FontAwesomeIcon icon={faEnvelopeOpen} />
            <span>Chưa đọc: {stats.unread}</span>
          </div>
          <div className={styles.statItem}>
            <FontAwesomeIcon icon={faInbox} />
            <span>Đã đọc: {stats.read}</span>
          </div>
        </div>

        {/* Notification List */}
        <div className={styles.notificationList}>
          {sortedNotifications.length === 0 ? (
            <div className={styles.emptyState}>
              <FontAwesomeIcon icon={faBell} className={styles.emptyIcon} />
              <p>Không có thông báo nào</p>
            </div>
          ) : (
            <div className={styles.notificationScrollContainer}>
              {sortedNotifications.map(renderNotificationItem)}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NotificationInfo;
