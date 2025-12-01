import React, { useState } from 'react';
import { PasswordChange } from '@/utils/type/profile';
import { PROFILE_MESSAGES } from '@/const/profileMessages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import styles from './changePassword.module.scss';

interface ChangePasswordProps {
  passwordData: PasswordChange;
  isLoading: boolean;
  onFieldChange: (field: keyof PasswordChange, value: string) => void;
  onChangePassword: () => void;
}

interface ValidationErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  passwordData,
  isLoading,
  onFieldChange,
  onChangePassword
}) => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const toggleVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateAndSubmit = () => {
    const newErrors: ValidationErrors = {};
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (!strongPasswordRegex.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số';
    } else if (passwordData.newPassword === passwordData.currentPassword) {
      newErrors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu hiện tại';
    }

    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onChangePassword();
    }
  };

  const handleInputChange = (field: keyof PasswordChange, value: string) => {
    onFieldChange(field, value);
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className={styles.changePasswordContainer}>
      <div className={styles.section}>
        <h2>Đổi mật khẩu</h2>
        <p className={styles.sectionDescription}>
          Để bảo mật tài khoản, hãy sử dụng mật khẩu mạnh (tối thiểu 8 ký tự, gồm chữ hoa, thường và số).
        </p>

        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">Mật khẩu hiện tại *</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPasswords.current ? "text" : "password"}
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              className={`${styles.input} ${errors.currentPassword ? styles.inputError : ''}`}
              placeholder="Nhập mật khẩu hiện tại"
            />
            <button 
              type="button"
              className={styles.toggleBtn}
              onClick={() => toggleVisibility('current')}
            >
              <FontAwesomeIcon icon={showPasswords.current ? faEyeSlash : faEye} />
            </button>
          </div>
          {errors.currentPassword && <span className={styles.errorMessage}>{errors.currentPassword}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newPassword">Mật khẩu mới *</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPasswords.new ? "text" : "password"}
              id="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className={`${styles.input} ${errors.newPassword ? styles.inputError : ''}`}
              placeholder="Nhập mật khẩu mới"
            />
            <button 
              type="button"
              className={styles.toggleBtn}
              onClick={() => toggleVisibility('new')}
            >
              <FontAwesomeIcon icon={showPasswords.new ? faEyeSlash : faEye} />
            </button>
          </div>
          {errors.newPassword ? (
            <span className={styles.errorMessage}>{errors.newPassword}</span>
          ) : (
            <small className={styles.helpText}>Tối thiểu 8 ký tự, gồm chữ hoa, thường và số</small>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPasswords.confirm ? "text" : "password"}
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              placeholder="Nhập lại mật khẩu mới"
            />
             <button 
              type="button"
              className={styles.toggleBtn}
              onClick={() => toggleVisibility('confirm')}
            >
              <FontAwesomeIcon icon={showPasswords.confirm ? faEyeSlash : faEye} />
            </button>
          </div>
          {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
        </div>

        <button
          onClick={validateAndSubmit}
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