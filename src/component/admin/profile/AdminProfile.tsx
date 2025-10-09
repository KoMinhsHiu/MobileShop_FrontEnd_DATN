import React, { useState, useMemo } from 'react';
import { ProfileTab } from './adminProfile.types';
import { useAdminProfile } from './hooks/useAdminProfile';
import { useChangePassword } from './hooks/useChangePassword';
import { useActivityLog } from './hooks/useActivityLog';
import TabNavigation from './components/TabNavigation';
import PersonalInfo from './components/PersonalInfo';
import ChangePassword from './components/ChangePassword';
import ActivityLog from './components/ActivityLog';
import styles from './AdminProfile.module.scss';

const AdminProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.PERSONAL);

  // Custom hooks
  const {
    adminProfile,
    isLoading: profileLoading,
    errors: profileErrors,
    handleFieldChange,
    handleAvatarUpload,
    handleUpdateProfile
  } = useAdminProfile();

  const {
    passwordData,
    showPasswords,
    isLoading: passwordLoading,
    errors: passwordErrors,
    handlePasswordChange,
    togglePasswordVisibility,
    handleChangePassword
  } = useChangePassword();

  const {
    activityLogs,
    isLoading: activityLoading,
    error: activityError
  } = useActivityLog();

  // Memoized values
  const isLoading = useMemo(() => 
    profileLoading || passwordLoading || activityLoading, 
    [profileLoading, passwordLoading, activityLoading]
  );

  return (
    <div className={styles.adminProfile}>
      <div className={styles.header}>
        <h1>Quản lý Profile</h1>
        <p>Quản lý thông tin cá nhân và cài đặt tài khoản</p>
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles.content}>
        {activeTab === ProfileTab.PERSONAL && (
          <PersonalInfo
            profile={adminProfile}
            errors={profileErrors}
            isLoading={profileLoading}
            onFieldChange={handleFieldChange}
            onAvatarUpload={handleAvatarUpload}
            onUpdate={handleUpdateProfile}
          />
        )}

        {activeTab === ProfileTab.PASSWORD && (
          <ChangePassword
            passwordData={passwordData}
            errors={passwordErrors}
            isLoading={passwordLoading}
            showPasswords={showPasswords}
            onPasswordChange={handlePasswordChange}
            onToggleVisibility={togglePasswordVisibility}
            onChangePassword={handleChangePassword}
          />
        )}

        {activeTab === ProfileTab.ACTIVITY && (
          <ActivityLog
            logs={activityLogs}
            isLoading={activityLoading}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
