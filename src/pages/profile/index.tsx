import React from 'react';
import styles from './profile.module.scss';
import { useProfile } from '@/utils/hooks/api/useProfile';
import PersonalInfo from '@/component/profile/personalInfo';
import ChangePassword from '@/component/profile/changePassword';
import TabNavigation from '@/component/profile/tabNavigation';
import { withAuth } from '@/component/auth';
import PointHistory from '@/component/profile/pointHistory';
import AddressBook from '@/component/profile/addressBook';

const ProfilePageComponent: React.FC = () => {
  const {
    activeTab,
    isLoading,
    personalInfo,
    passwordData,
    pointHistory,
    isAuthenticated,
    setActiveTab,
    handlePersonalInfoChange,
    handlePasswordChange,
    handleUpdatePersonalInfo,
    handleChangePassword,
    handleAvatarUpload,
    logout
  } = useProfile();

  // Note: Auth protection is now handled by withAuth HOC

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
          </div>
        )}

        {/* Address Book Tab */}
        {activeTab === 'address' && (
          <div className={styles.tabContent}>
            <AddressBook />
          </div>
        )}

        {/* Point History Tab */}
        {activeTab === 'point' && (
          <div className={styles.tabContent}>
            <PointHistory
              pointHistory={pointHistory}
              pointsBalance={personalInfo.pointsBalance ?? 0}
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
        <button onClick={() => logout()} className={styles.logoutButton}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

// Protect the profile page with authentication
const ProfilePage = withAuth(ProfilePageComponent);

export default ProfilePage;
