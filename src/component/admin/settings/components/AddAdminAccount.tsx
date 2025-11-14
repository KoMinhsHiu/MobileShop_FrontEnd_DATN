import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faLock, 
  faEye, 
  faEyeSlash,
  faUserPlus,
  faSpinner,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@/component/common/ToastContainer';
import { authAPI, CreateAdminUserRequest } from '@/utils/api/auth';
import styles from '../AdminProfile.module.scss';

interface FormData extends CreateAdminUserRequest {
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

const AddAdminAccount: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError, ToastContainer } = useToast();

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Vui lòng kiểm tra lại thông tin đã nhập');
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...adminUserData } = formData;
      await authAPI.createAdminUser(adminUserData);
      
      showSuccess('Tạo tài khoản admin thành công!');
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
      
    } catch (error: any) {
      console.error('Create admin error:', error);
      showError(error.message || 'Có lỗi xảy ra khi tạo tài khoản admin');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className={styles.addAdminAccount}>
      <div className={styles.section}>
        <h2>
          <FontAwesomeIcon icon={faUserPlus} />
          Tạo tài khoản Admin
        </h2>

        <form onSubmit={handleSubmit} className={styles.addAdminForm}>
          <div className={styles.formGrid}>
            {/* Username Field */}
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>
                <FontAwesomeIcon icon={faUser} />
                Tên đăng nhập *
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                placeholder="Nhập tên đăng nhập"
                disabled={isLoading}
              />
              {errors.username && (
                <span className={styles.errorMessage}>{errors.username}</span>
              )}
            </div>

            {/* Email Field */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                <FontAwesomeIcon icon={faEnvelope} />
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="Nhập địa chỉ email"
                disabled={isLoading}
              />
              {errors.email && (
                <span className={styles.errorMessage}>{errors.email}</span>
              )}
            </div>

            {/* Phone Field */}
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                <FontAwesomeIcon icon={faPhone} />
                Số điện thoại *
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                placeholder="Nhập số điện thoại"
                disabled={isLoading}
              />
              {errors.phone && (
                <span className={styles.errorMessage}>{errors.phone}</span>
              )}
            </div>

            {/* Password Field */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                <FontAwesomeIcon icon={faLock} />
                Mật khẩu *
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  placeholder="Nhập mật khẩu"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.password && (
                <span className={styles.errorMessage}>{errors.password}</span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                <FontAwesomeIcon icon={faLock} />
                Xác nhận mật khẩu *
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                  placeholder="Nhập lại mật khẩu"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.confirmPassword && (
                <span className={styles.errorMessage}>{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          {/* Password Requirements */}
          <div className={styles.passwordRequirements}>
            <h4>Yêu cầu mật khẩu:</h4>
            <ul>
              <li>Ít nhất 6 ký tự</li>
              <li>Chứa ít nhất 1 chữ hoa (A-Z)</li>
              <li>Chứa ít nhất 1 chữ thường (a-z)</li>
              <li>Chứa ít nhất 1 chữ số (0-9)</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetButton}
              disabled={isLoading}
            >
              Làm mới
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Đang tạo...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheck} />
                  Tạo tài khoản
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddAdminAccount;
