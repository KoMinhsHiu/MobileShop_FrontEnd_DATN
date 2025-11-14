import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '@/utils/api/auth';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  phone: string;
  roleId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

interface UseFetchAdminUserReturn {
  adminData: AdminUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateAdminProfile: (username: string) => Promise<void>;
}

export const useFetchAdminUser = (): UseFetchAdminUserReturn => {
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('👤 Fetching admin user data...');
      const response = await authAPI.getCurrentAdmin();
      
      console.log('✅ Admin data fetched:', response.data);
      setAdminData(response.data);
    } catch (error: any) {
      console.error('Failed to fetch admin data:', error);
      setError(error.message || 'Failed to fetch admin data');
      setAdminData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAdminProfile = useCallback(async (username: string) => {
    try {
      console.log('📝 Updating admin profile with username:', username);
      
      const response = await authAPI.updateAdminProfile(username);
      
      // Update local state immediately
      setAdminData(prev => prev ? { ...prev, username } : null);
      
      console.log('✅ Admin profile updated successfully');
      return response;
    } catch (error: any) {
      console.error('Failed to update admin profile:', error);
      throw error;
    }
  }, []);

  const refetch = useCallback(async () => {
    console.log('🔄 Refreshing admin data...');
    await fetchAdminData();
  }, [fetchAdminData]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  return {
    adminData,
    loading,
    error,
    refetch,
    updateAdminProfile
  };
};

export default useFetchAdminUser;
