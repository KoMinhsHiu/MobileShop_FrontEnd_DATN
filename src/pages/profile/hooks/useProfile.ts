import { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { UserProfile, PasswordChange, ProfileTab } from '../profile.types';
import { PROFILE_MESSAGES } from '../constants/profileMessages';
import { customerAPI } from '@/utils/api/customer';

export const useProfile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const [isLoading, setIsLoading] = useState(false);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState<UserProfile>({
    fullName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    dateOfBirth: '',
    pointsBalance: 0
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

  // Load user data from API
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (isAuthenticated) {
        try {
          setIsLoading(true);
          const response = await customerAPI.getMe();
          
          if (response.status === 200 && response.data) {
            const { data } = response;
            setPersonalInfo({
              fullName: `${data.firstName} ${data.lastName}`,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.user.email,
              phone: data.user.phone,
              address: '', // API không trả về address, có thể thêm sau
              avatar: '', // API không trả về avatar, có thể thêm sau
              dateOfBirth: data.dateOfBirth,
              pointsBalance: data.pointsBalance
            });
          }
        } catch (error: any) {
          console.error('Error fetching customer data:', error);
          toast.error(error.message || 'Không thể lấy thông tin người dùng');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCustomerData();
  }, [isAuthenticated]);

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
      // Prepare update data
      const updateData = {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        phone: personalInfo.phone,
        dateOfBirth: personalInfo.dateOfBirth
      };

      // Call API to update customer info
      const response = await customerAPI.updateMe(updateData);
      
      if (response.status === 200 && response.data) {
        const { data } = response;
        setPersonalInfo(prev => ({
          ...prev,
          fullName: `${data.firstName} ${data.lastName}`,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.user.phone,
          dateOfBirth: data.dateOfBirth,
          pointsBalance: data.pointsBalance
        }));
        toast.success(PROFILE_MESSAGES.SUCCESS.UPDATE_INFO);
      }
    } catch (error: any) {
      console.error('Error updating customer info:', error);
      toast.error(error.message || PROFILE_MESSAGES.ERROR.UPDATE_INFO);
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
