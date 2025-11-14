import React, { useState, useMemo } from 'react';
import { ProfileTab } from './adminProfile.types';
import TabNavigation from './components/TabNavigation';
import PersonalInfo from './components/PersonalInfo';
import ChangePassword from './components/ChangePassword';
import NotificationInfo from './components/NotificationInfo';
import AddAdminAccount from './components/AddAdminAccount';
import { useAdminContext } from '@/context/adminContext';
import styles from './AdminProfile.module.scss';

const AdminProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.PERSONAL);

  // Admin context for data management
  const {
    adminData,
    loadingAdmin,
    adminError,
    updateAdminProfile
  } = useAdminContext();

  return (
    <div className={styles.adminProfile}>
      <div className={styles.header}>
        <h1>Cài đặt</h1>
        <p>Quản lý thông tin cá nhân, thông báo, và các cài đặt khác</p>
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles.content}>
        {activeTab === ProfileTab.PERSONAL && (
          <PersonalInfo
            adminData={adminData}
            error={adminError}
            isLoading={loadingAdmin}
            onUpdateProfile={updateAdminProfile}
          />
        )}

        {activeTab === ProfileTab.PASSWORD && (
          <ChangePassword />
        )}

        {activeTab === ProfileTab.NOTIFICATION && (
          <NotificationInfo />
        )}

        {activeTab === ProfileTab.ACCOUNT && (
          <AddAdminAccount />
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
