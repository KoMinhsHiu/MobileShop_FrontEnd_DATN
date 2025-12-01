import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { authAPI } from '@/utils/api/auth';
import { useToast } from '@/component/common/ToastContainer';
import styles from '../AdminProfile.module.scss';

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

interface ValidationErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ChangePassword: React.FC = () => {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    current: false,
    new: false,
    confirm: false
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError, ToastContainer } = useToast();

  const validatePasswords = (): boolean => {
    const newErrors: ValidationErrors = {};

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    // Validate current password
    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = 'Mật khẩu hiện tại không được để trống';
    }
    
    // Validate new password
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'Mật khẩu mới không được để trống';
    } else if (!strongPasswordRegex.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số';
    } else if (passwordData.newPassword === passwordData.currentPassword) {
      newErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
    }
    
    // Validate confirm password
    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleToggleVisibility = (field: keyof ShowPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChangePassword = async () => {
    if (!validatePasswords()) {
      return;
    }

    try {
      setIsLoading(true);
      
      await authAPI.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      // Reset form on success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setShowPasswords({
        current: false,
        new: false,
        confirm: false
      });
      
      showSuccess('Đổi mật khẩu thành công!');
      
    } catch (error: any) {
      console.error('Change password failed:', error);
      showError(error.message || 'Đổi mật khẩu thất bại');
    } finally {
      setIsLoading(false);
    }
  };

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
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className={`${styles.input} ${errors.currentPassword ? styles.error : ''}`}
                placeholder="Nhập mật khẩu hiện tại"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => handleToggleVisibility('current')}
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
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className={`${styles.input} ${errors.newPassword ? styles.error : ''}`}
                placeholder="Nhập mật khẩu mới"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => handleToggleVisibility('new')}
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
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className={`${styles.input} ${errors.confirmPassword ? styles.error : ''}`}
                placeholder="Xác nhận mật khẩu mới"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => handleToggleVisibility('confirm')}
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
            onClick={handleChangePassword}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faLock} />
            {isLoading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
