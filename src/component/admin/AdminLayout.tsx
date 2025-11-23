import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell,
  faBars,
  faTimes,
  faChevronDown,
  faSignOutAlt,
  faUser,
  faCog,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { MENU_ITEMS } from './admin.constants';
import { AdminLayoutProps } from './admin.types';
import { useAuth } from '@/context/authContext';
import { useToast } from '@/component/common/ToastContainer';
import { useAdminContext } from '@/context/adminContext';
import styles from './AdminLayout.module.scss';

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage = '/admin' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Admin context for shared state
  const {
    unreadNotifications,
    loadingNotifications,
    adminData,
    loadingAdmin
  } = useAdminContext();
  
  const { logout } = useAuth();
  const { showSuccess, showError, ToastContainer } = useToast();

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    setProfileMenuOpen(false); // Close profile menu
    
    try {
      // Use AuthContext logout function
      await logout();
      
      // Show success message
      showSuccess('Đăng xuất thành công!');
      
      // Clear all storage immediately before redirect
      localStorage.clear();
      sessionStorage.clear();
      
      // Use window.location.replace to avoid history issues
      setTimeout(() => {
        window.location.replace('/LoginSignup');
      }, 1000);
      
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Show error message to user
      showError('Đăng xuất thất bại. Vui lòng thử lại.');
      
      // Clear all storage immediately before redirect
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to login page anyway
      setTimeout(() => {
        window.location.replace('/LoginSignup');
      }, 2000);
      
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <Image src="/images/PhoneHubLogo.png" priority alt="Logo" className={styles.logoImage} width={40} height={40} />
            <h2 className={styles.logo}>Admin Dashboard</h2>
          </div>
          <button 
            className={styles.closeBtn}
            onClick={() => setSidebarOpen(false)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <nav className={styles.nav}>
          {MENU_ITEMS.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`${styles.navItem} ${item.href === currentPage ? styles.active : ''}`}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button 
              className={styles.menuBtn}
              onClick={() => setSidebarOpen(true)}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            <div className={styles.headerTitle}>
              <Image src="/images/PhoneHubLogo.png" priority alt="Logo" className={styles.headerLogo} width={32} height={32} />
              <h1>Admin Dashboard</h1>
            </div>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.notificationContainer}>
              <button 
                className={styles.notificationBtn}
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <FontAwesomeIcon icon={faBell} className={styles.bellIcon} />
                {unreadNotifications.length > 0 && (
                  <span className={styles.notificationBadge}>{unreadNotifications.length}</span>
                )}
              </button>
              
              {notificationOpen && (
                <div className={styles.notificationDropdown}>
                  <div className={styles.notificationHeader}>
                    <h3>Thông báo</h3>
                    <span className={styles.notificationCount}>{unreadNotifications.length} mới</span>
                  </div>
                  <div className={styles.notificationList}>
                    {loadingNotifications ? (
                      <div className={styles.notificationItem}>
                        <div className={styles.notificationContent}>
                          <p>Đang tải thông báo...</p>
                        </div>
                      </div>
                    ) : unreadNotifications.length === 0 ? (
                      <div className={styles.notificationItem}>
                        <div className={styles.notificationContent}>
                          <p>Không có thông báo mới</p>
                        </div>
                      </div>
                    ) : (
                      unreadNotifications.map((notification) => (
                        <div key={notification.id} className={styles.notificationItem}>
                          <div className={styles.notificationContent}>
                            <h4 className={styles.notificationTitle}>{notification.title}</h4>
                            <p className={styles.notificationMessage}>{notification.message}</p>
                            <span className={styles.notificationTime}>
                              {new Date(notification.createdAt).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className={`${styles.notificationDot} ${styles.unread}`} />
                        </div>
                      ))
                    )}
                  </div>
                  <div className={styles.notificationFooter}>
                    <Link href="/admin/settings">Xem tất cả thông báo</Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.profileContainer}>
              <div 
                className={styles.profile}
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <span>
                  {loadingAdmin ? 'Đang tải...' : (adminData?.username || 'Admin User')}
                </span>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
              
              {profileMenuOpen && (
                <div className={styles.profileMenu}>
                  <Link href="/admin/settings" className={styles.menuItem}>
                    <FontAwesomeIcon icon={faCog} />
                    Cài đặt
                  </Link>
                  <button 
                    className={styles.menuItem}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
                    ) : (
                      <FontAwesomeIcon icon={faSignOutAlt} />
                    )}
                    {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
