import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faBell, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { TabNavigationProps, ProfileTab, TabConfig } from '../adminProfile.types';
import styles from '../AdminProfile.module.scss';

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: TabConfig[] = [
    { id: ProfileTab.PERSONAL, label: 'Thông tin cá nhân', icon: faUser },
    { id: ProfileTab.PASSWORD, label: 'Đổi mật khẩu', icon: faLock },
    { id: ProfileTab.NOTIFICATION, label: 'Thông báo', icon: faBell },
    { id: ProfileTab.ACCOUNT, label: 'Tạo Admin Account', icon: faUserPlus }
  ];

  return (
    <div className={styles.tabNavigation}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
          type="button"
        >
          <FontAwesomeIcon icon={tab.icon} />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
