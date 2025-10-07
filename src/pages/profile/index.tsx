import React from 'react';
import toast from 'react-hot-toast';
import styles from './profile.module.scss';
import { useProfile } from './hooks/useProfile';
import { PROFILE_MESSAGES } from './constants/profileMessages';
import PersonalInfo from '@/component/profile/personalInfo';
import ChangePassword from '@/component/profile/changePassword';
import AdditionalOptions from '@/component/profile/additionalOptions';
import TabNavigation from '@/component/profile/tabNavigation';

const ProfilePage: React.FC = () => {
  const {
    activeTab,
    isLoading,
    personalInfo,
    passwordData,
    isAuthenticated,
    setActiveTab,
    handlePersonalInfoChange,
    handlePasswordChange,
    handleUpdatePersonalInfo,
    handleChangePassword,
    handleAvatarUpload,
    logout
  } = useProfile();

  if (!isAuthenticated) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>Quản lý tài khoản</h1>
        <p>Quản lý thông tin cá nhân và bảo mật tài khoản của bạn</p>
      </div>

      <div className={styles.profileContent}>
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div className={styles.tabContent}>
            <PersonalInfo
              personalInfo={personalInfo}
              isLoading={isLoading}
              onFieldChange={handlePersonalInfoChange}
              onAvatarUpload={handleAvatarUpload}
              onUpdate={handleUpdatePersonalInfo}
            />
            <AdditionalOptions
              onViewHistory={() => toast.info(PROFILE_MESSAGES.INFO.FEATURE_DEVELOPING)}
              onManagePayment={() => toast.info(PROFILE_MESSAGES.INFO.FEATURE_DEVELOPING)}
            />
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === 'password' && (
          <div className={styles.tabContent}>
            <ChangePassword
              passwordData={passwordData}
              isLoading={isLoading}
              onFieldChange={handlePasswordChange}
              onChangePassword={handleChangePassword}
            />
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className={styles.logoutSection}>
        <button onClick={logout} className={styles.logoutButton}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
