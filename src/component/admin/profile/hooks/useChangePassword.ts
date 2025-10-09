import { useState, useCallback } from 'react';
import { ChangePasswordData, FormErrors, PasswordVisibility } from '../adminProfile.types';

export const useChangePassword = () => {
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState<PasswordVisibility>({
    current: false,
    new: false,
    confirm: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validatePassword = useCallback((password: string): string | undefined => {
    if (!password) return 'Mật khẩu không được để trống';
    if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
    }
    return undefined;
  }, []);

  const handlePasswordChange = useCallback((field: keyof ChangePasswordData, value: string) => {
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as keyof FormErrors];
      return newErrors;
    });

    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const togglePasswordVisibility = useCallback((field: keyof PasswordVisibility) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  }, []);

  const validatePasswordForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate current password
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Mật khẩu hiện tại không được để trống';
    }

    // Validate new password
    const newPasswordError = validatePassword(passwordData.newPassword);
    if (newPasswordError) {
      newErrors.newPassword = newPasswordError;
    }

    // Validate confirm password
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu mới và xác nhận mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [passwordData, validatePassword]);

  const handleChangePassword = useCallback(async () => {
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('Changing password:', passwordData);
      
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
      
      // Show success message
    } catch (error) {
      console.error('Error changing password:', error);
      setErrors({ general: 'Có lỗi xảy ra khi đổi mật khẩu' });
    } finally {
      setIsLoading(false);
    }
  }, [passwordData, validatePasswordForm]);

  return {
    passwordData,
    showPasswords,
    isLoading,
    errors,
    handlePasswordChange,
    togglePasswordVisibility,
    handleChangePassword
  };
};
