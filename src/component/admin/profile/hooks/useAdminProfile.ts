import { useState, useCallback } from 'react';
import { AdminProfile, AdminRole, FormErrors } from '../adminProfile.types';

// Mock data - trong thực tế sẽ lấy từ API
const MOCK_ADMIN_PROFILE: AdminProfile = {
  id: '1',
  fullName: 'Nguyễn Văn Admin',
  email: 'admin@phonehub.com',
  phone: '0123456789',
  avatar: '/images/logo.png',
  role: AdminRole.SUPER_ADMIN,
  createdAt: '2024-01-01',
  lastLoginAt: '2024-12-19 10:30:00'
};

export const useAdminProfile = () => {
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(MOCK_ADMIN_PROFILE);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = useCallback((field: keyof AdminProfile, value: string): string | undefined => {
    switch (field) {
      case 'fullName':
        if (!value.trim()) return 'Họ tên không được để trống';
        if (value.trim().length < 2) return 'Họ tên phải có ít nhất 2 ký tự';
        break;
      case 'phone':
        if (value && !/^[0-9+\-\s()]+$/.test(value)) {
          return 'Số điện thoại không hợp lệ';
        }
        break;
      default:
        break;
    }
    return undefined;
  }, []);

  const handleFieldChange = useCallback((field: keyof AdminProfile, value: string) => {
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as keyof FormErrors];
      return newErrors;
    });

    setAdminProfile(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleAvatarUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, avatar: 'Chỉ được upload file ảnh' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: 'Kích thước file không được vượt quá 5MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setAdminProfile(prev => ({
        ...prev,
        avatar: e.target?.result as string
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const validateProfile = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate required fields
    const fullNameError = validateField('fullName', adminProfile.fullName);
    if (fullNameError) newErrors.fullName = fullNameError;

    const phoneError = validateField('phone', adminProfile.phone);
    if (phoneError) newErrors.phone = phoneError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [adminProfile, validateField]);

  const handleUpdateProfile = useCallback(async () => {
    if (!validateProfile()) return;

    setIsLoading(true);
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('Updating profile:', adminProfile);
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ general: 'Có lỗi xảy ra khi cập nhật thông tin' });
    } finally {
      setIsLoading(false);
    }
  }, [adminProfile, validateProfile]);

  return {
    adminProfile,
    isLoading,
    errors,
    handleFieldChange,
    handleAvatarUpload,
    handleUpdateProfile
  };
};
