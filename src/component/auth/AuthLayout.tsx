import React from 'react';
import styles from './auth.module.scss';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showDemoInfo?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  showDemoInfo = false 
}) => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        {/* Logo and Title */}
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <img
              src="/images/PhoneHubLogo.png"
              alt="PhoneHub Logo"
              width={120}
              height={80}
              className={styles.logo}
            />
          </div>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {/* Demo Info - only for login */}
        {showDemoInfo && (
          <div className={styles.demoInfo}>
            <p className={styles.demoText}>
              <strong>Thông tin đăng nhập demo:</strong><br />
              Username: <code>user</code><br />
              Password: <code>user123</code>
            </p>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
