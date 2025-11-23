import React from 'react';
import { ProfileTab } from '@/utils/type/profile';
import styles from './tabNavigation.module.scss';

interface TabNavigationProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'personal' as ProfileTab, label: 'Thông tin cá nhân' },
    { id: 'password' as ProfileTab, label: 'Đổi mật khẩu' }
  ];

  return (
    <div className={styles.tabNavigation}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
