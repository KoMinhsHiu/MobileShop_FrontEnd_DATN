import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/authContext';
import styles from './auth.module.scss';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  
  // Get returnUrl from query params
  const returnUrl = router.query.returnUrl as string;
  
  // Map returnUrl to friendly page name
  const getPageName = (url: string): string => {
    if (!url) return '';
    if (url.includes('/cart')) return 'Giỏ hàng';
    if (url.includes('/orders')) return 'Đơn hàng';
    if (url.includes('/profile')) return 'Tài khoản';
    if (url.includes('/checkout')) return 'Thanh toán';
    return 'trang yêu cầu';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      return;
    }

    await login(formData.username, formData.password);
  };

  const handleForgotPassword = () => {
    alert("Tính năng quên mật khẩu sẽ được phát triển trong tương lai");
  };

  const handleSignUp = () => {
    router.push("/LoginSignup/register");
  };

  const handleGoogleLogin = () => {
    alert("Tính năng đăng nhập Google sẽ được phát triển trong tương lai");
  };


  return (
    <>
      {/* Show notification if redirected from protected page */}
      {returnUrl && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          color: '#856404'
        }}>
          <strong>⚠️ Yêu cầu đăng nhập</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
            Bạn cần đăng nhập để truy cập <strong>{getPageName(returnUrl)}</strong>
          </p>
        </div>
      )}
      
      {/* Login Form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>
            Username hoặc Email
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Nhập username hoặc email"
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

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      {/* Additional Links */}
      <div className={styles.links}>
        <button
          type="button"
          className={styles.forgotPassword}
          onClick={handleForgotPassword}
        >
          Quên mật khẩu?
        </button>
      </div>

      {/* Social Login */}
      <div className={styles.socialLogin}>
        <div className={styles.divider}>
          <span>Hoặc đăng nhập bằng</span>
        </div>
        
        <div className={styles.socialButtons}>
          <button
            type="button"
            className={`${styles.socialButton} ${styles.google}`}
            onClick={handleGoogleLogin}
          >
            <span className={styles.socialIcon}>🔍</span>
            Google
          </button>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className={styles.signUpSection}>
        <span className={styles.signUpText}>Chưa có tài khoản? </span>
        <button
          type="button"
          className={styles.signUpLink}
          onClick={handleSignUp}
        >
          Đăng ký ngay
        </button>
      </div>
    </>
  );
};

export default LoginForm;
