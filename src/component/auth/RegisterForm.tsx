import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './auth.module.scss';

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    alert("Tính năng đăng ký sẽ được phát triển trong tương lai");
  };

  const handleLogin = () => {
    router.push("/LoginSignup/login");
  };

  const handleGoogleRegister = () => {
    alert("Tính năng đăng ký Google sẽ được phát triển trong tương lai");
  };

  const handleFacebookRegister = () => {
    alert("Tính năng đăng ký Facebook sẽ được phát triển trong tương lai");
  };

  return (
    <>
      {/* Registration Form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="fullName" className={styles.label}>
            Họ và tên
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Nhập họ và tên"
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
            >
              {showPassword ? "🙈" : "👁️"}
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
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          Đăng ký
        </button>
      </form>

      {/* Social Registration */}
      <div className={styles.socialLogin}>
        <div className={styles.divider}>
          <span>Hoặc đăng ký bằng</span>
        </div>
        
        <div className={styles.socialButtons}>
          <button
            type="button"
            className={`${styles.socialButton} ${styles.google}`}
            onClick={handleGoogleRegister}
          >
            <span className={styles.socialIcon}>🔍</span>
            Google
          </button>
          
          <button
            type="button"
            className={`${styles.socialButton} ${styles.facebook}`}
            onClick={handleFacebookRegister}
          >
            <span className={styles.socialIcon}>📘</span>
            Facebook
          </button>
        </div>
      </div>

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
