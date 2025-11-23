import React from 'react';
import { PasswordChange } from '@/utils/type/profile';
import { PROFILE_MESSAGES } from '@/const/profileMessages';
import styles from './changePassword.module.scss';

interface ChangePasswordProps {
  passwordData: PasswordChange;
  isLoading: boolean;
  onFieldChange: (field: keyof PasswordChange, value: string) => void;
  onChangePassword: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  passwordData,
  isLoading,
  onFieldChange,
  onChangePassword
}) => {
  return (
    <div className={styles.changePasswordContainer}>
      <div className={styles.section}>
        <h2>Đổi mật khẩu</h2>
        <p className={styles.sectionDescription}>
          Để bảo mật tài khoản, hãy sử dụng mật khẩu mạnh và không chia sẻ với ai khác.
        </p>

        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">Mật khẩu hiện tại *</label>
          <input
            type="password"
            id="currentPassword"
            value={passwordData.currentPassword}
            onChange={(e) => onFieldChange('currentPassword', e.target.value)}
            className={styles.input}
            placeholder="Nhập mật khẩu hiện tại"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newPassword">Mật khẩu mới *</label>
          <input
            type="password"
            id="newPassword"
            value={passwordData.newPassword}
            onChange={(e) => onFieldChange('newPassword', e.target.value)}
            className={styles.input}
            placeholder="Nhập mật khẩu mới"
          />
          <small className={styles.helpText}>Mật khẩu phải có ít nhất 6 ký tự</small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</label>
          <input
            type="password"
            id="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={(e) => onFieldChange('confirmPassword', e.target.value)}
            className={styles.input}
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>

        <button
          onClick={onChangePassword}
          disabled={isLoading}
          className={styles.updateButton}
        >
          {isLoading ? PROFILE_MESSAGES.LOADING.CHANGE_PASSWORD : 'Đổi mật khẩu'}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
