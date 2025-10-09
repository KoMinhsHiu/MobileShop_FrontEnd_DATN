import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell,
  faBars,
  faTimes,
  faChevronDown,
  faSignOutAlt,
  faUser,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import { MENU_ITEMS, NOTIFICATIONS } from './admin.constants';
import { AdminLayoutProps } from './admin.types';
import styles from './AdminLayout.module.scss';

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage = '/admin' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <img src="/images/PhoneHubLogo.png" alt="Logo" className={styles.logoImage} />
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
            <a
              key={index}
              href={item.href}
              className={`${styles.navItem} ${item.href === currentPage ? styles.active : ''}`}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
            </a>
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
              <img src="/images/PhoneHubLogo.png" alt="Logo" className={styles.headerLogo} />
              <h1>Admin Dashboard</h1>
            </div>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.notificationContainer}>
              <button 
                className={styles.notificationBtn}
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <FontAwesomeIcon icon={faBell} />
                <span className={styles.notificationBadge}>{NOTIFICATIONS.length}</span>
              </button>
              
              {notificationOpen && (
                <div className={styles.notificationDropdown}>
                  <div className={styles.notificationHeader}>
                    <h3>Thông báo</h3>
                    <span className={styles.notificationCount}>{NOTIFICATIONS.length} mới</span>
                  </div>
                  <div className={styles.notificationList}>
                    {NOTIFICATIONS.map((notification) => (
                      <div key={notification.id} className={styles.notificationItem}>
                        <div className={styles.notificationContent}>
                          <p className={styles.notificationMessage}>{notification.message}</p>
                          <span className={styles.notificationTime}>{notification.time}</span>
                        </div>
                        <div className={`${styles.notificationDot} ${styles[notification.type]}`} />
                      </div>
                    ))}
                  </div>
                  <div className={styles.notificationFooter}>
                    <a href="/admin/notifications">Xem tất cả thông báo</a>
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.profileContainer}>
              <div 
                className={styles.profile}
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <div className={styles.avatar}>
                  <img src="/images/logo.png" alt="Admin" />
                </div>
                <span>Admin User</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
              
              {profileMenuOpen && (
                <div className={styles.profileMenu}>
                  <a href="/admin/profile" className={styles.menuItem}>
                    <FontAwesomeIcon icon={faUser} />
                    Profile
                  </a>
                  <a href="/admin/settings" className={styles.menuItem}>
                    <FontAwesomeIcon icon={faCog} />
                    Cài đặt
                  </a>
                  <button className={styles.menuItem}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Đăng xuất
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
    </div>
  );
};

export default AdminLayout;
