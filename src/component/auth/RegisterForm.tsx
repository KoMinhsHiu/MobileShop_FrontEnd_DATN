import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/authContext';
import { validateRegisterForm } from '@/utils/validation';
import toast from 'react-hot-toast';
import styles from './auth.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const { email, firstName, lastName } = router.query;

      setFormData(prev => ({
        ...prev,
        email: email as string || '',
        firstName: firstName as string || '',
        lastName: lastName as string || '',
      }));
    }
  }, [router.isReady, router.query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isLoginWithGoogle = router.query.email && router.query.firstName && router.query.lastName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateRegisterForm(formData);
    
    if (!validation.isValid) {
      // Show first error
      toast.error(validation.errors[0]);
      return;
    }
    
    // Prepare data for API
    const registerData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      roleId: 1, // Default role for regular users
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
    };

    await register(registerData);
  };

  const handleLogin = () => {
    router.push("/LoginSignup/login");
  };

  const handleGoogleRegister = () => {
    alert("Tính năng đăng ký Google sẽ được phát triển trong tương lai");
  };

  return (
    <>
      {isLoginWithGoogle && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          color: '#856404',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          <strong>Tiếp tục đăng ký</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
            Vui lòng hoàn tất đăng ký với các thông tin bên dưới để tạo tài khoản.
          </p>
        </div>
      )}

      {/* Registration Form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="firstName" className={styles.label}>
            Tên
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Nhập tên"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="lastName" className={styles.label}>
            Họ
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Nhập họ"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Nhập địa chỉ email"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>
            Tên đăng nhập
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Nhập tên đăng nhập"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phone" className={styles.label}>
            Số điện thoại
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="dateOfBirth" className={styles.label}>
            Ngày sinh
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Mật khẩu
          </label>
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Nhập mật khẩu"
              required
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Xác nhận mật khẩu
          </label>
          <div className={styles.passwordContainer}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Nhập lại mật khẩu"
              required
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>

      {/* Login Link */}
      <div className={styles.signUpSection}>
        <span className={styles.signUpText}>Đã có tài khoản? </span>
        <button
          type="button"
          className={styles.signUpLink}
          onClick={handleLogin}
        >
          Đăng nhập ngay
        </button>
      </div>
    </>
  );
};

export default RegisterForm;
