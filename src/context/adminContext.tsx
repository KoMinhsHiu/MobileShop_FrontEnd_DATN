import React, { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from '@/utils/hooks/api/useNotifications';
import { AdminUser, useFetchAdminUser } from '@/utils/hooks/api/useFetchAdminUser';
import { Notification } from '@/utils/api/notification';

interface AdminContextType {
  // Notifications
  notifications: Notification[];
  unreadNotifications: Notification[];
  loadingNotifications: boolean;
  notificationError: string | null;
  refetchNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markNotificationsAsRead: (notificationIds: number[]) => Promise<void>;
  
  // Admin User
  adminData: AdminUser | null;
  loadingAdmin: boolean;
  adminError: string | null;
  refetchAdminData: () => Promise<void>;
  updateAdminProfile: (username: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const {
    notifications,
    unreadNotifications,
    loading: loadingNotifications,
    error: notificationError,
    refetch: refetchNotifications,
    refreshNotifications,
    markAsRead: markNotificationsAsRead
  } = useNotifications();

  const {
    adminData,
    loading: loadingAdmin,
    error: adminError,
    refetch: refetchAdminData,
    updateAdminProfile
  } = useFetchAdminUser();

  const value: AdminContextType = {
    // Notifications
    notifications,
    unreadNotifications,
    loadingNotifications,
    notificationError,
    refetchNotifications,
    refreshNotifications,
    markNotificationsAsRead,
    
    // Admin User
    adminData,
    loadingAdmin,
    adminError,
    refetchAdminData,
    updateAdminProfile
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};

export default AdminProvider;