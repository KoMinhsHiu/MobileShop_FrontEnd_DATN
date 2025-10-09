import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ChangePasswordProps } from '../adminProfile.types';
import styles from '../AdminProfile.module.scss';

const ChangePassword: React.FC<ChangePasswordProps> = ({
  passwordData,
  errors,
  isLoading,
  showPasswords,
  onPasswordChange,
  onToggleVisibility,
  onChangePassword
}) => {
  return (
    <div className={styles.changePassword}>
      <div className={styles.section}>
        <h2>Đổi mật khẩu</h2>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword">Mật khẩu hiện tại *</label>
            <div className={styles.passwordInput}>
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => onPasswordChange('currentPassword', e.target.value)}
                className={`${styles.input} ${errors.currentPassword ? styles.error : ''}`}
                placeholder="Nhập mật khẩu hiện tại"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => onToggleVisibility('current')}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={showPasswords.current ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.currentPassword && (
              <small className={styles.errorText}>{errors.currentPassword}</small>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="newPassword">Mật khẩu mới *</label>
            <div className={styles.passwordInput}>
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => onPasswordChange('newPassword', e.target.value)}
                className={`${styles.input} ${errors.newPassword ? styles.error : ''}`}
                placeholder="Nhập mật khẩu mới"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => onToggleVisibility('new')}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={showPasswords.new ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.newPassword && (
              <small className={styles.errorText}>{errors.newPassword}</small>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</label>
            <div className={styles.passwordInput}>
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => onPasswordChange('confirmPassword', e.target.value)}
                className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
                placeholder="Xác nhận mật khẩu mới"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => onToggleVisibility('confirm')}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={showPasswords.confirm ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.confirmPassword && (
              <small className={styles.errorText}>{errors.confirmPassword}</small>
            )}
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button 
            className={styles.changePasswordButton}
            onClick={onChangePassword}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faLock} />
            {isLoading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
