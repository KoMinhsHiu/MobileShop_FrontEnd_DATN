import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { UserProfile, PasswordChange, ProfileTab } from '../profile.types';
import { PROFILE_MESSAGES } from '../constants/profileMessages';

export const useProfile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const [isLoading, setIsLoading] = useState(false);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState<UserProfile>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    avatar: ''
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/LoginSignup/login');
    }
  }, [isAuthenticated, router]);

  // Load user data
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handlePersonalInfoChange = (field: keyof UserProfile, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: keyof PasswordChange, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdatePersonalInfo = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(PROFILE_MESSAGES.SUCCESS.UPDATE_INFO);
    } catch (error) {
      toast.error(PROFILE_MESSAGES.ERROR.UPDATE_INFO);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(PROFILE_MESSAGES.ERROR.PASSWORD_MISMATCH);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error(PROFILE_MESSAGES.ERROR.PASSWORD_TOO_SHORT);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(PROFILE_MESSAGES.SUCCESS.CHANGE_PASSWORD);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(PROFILE_MESSAGES.ERROR.CHANGE_PASSWORD);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPersonalInfo(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    // State
    activeTab,
    isLoading,
    personalInfo,
    passwordData,
    isAuthenticated,
    
    // Actions
    setActiveTab,
    handlePersonalInfoChange,
    handlePasswordChange,
    handleUpdatePersonalInfo,
    handleChangePassword,
    handleAvatarUpload,
    logout
  };
};
