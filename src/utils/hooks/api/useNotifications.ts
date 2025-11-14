import { useState, useEffect, useCallback } from 'react';
import { notificationAPI, Notification } from '@/utils/api/notification';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadNotifications: Notification[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationIds: number[]) => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch both all notifications and unread notifications
      const [allNotificationsResponse, unreadNotificationsResponse] = await Promise.all([
        notificationAPI.getNotifications(),
        notificationAPI.getUnreadNotifications()
      ]);

      console.log('📨 Notifications fetched:', {
        all: allNotificationsResponse.data?.length || 0,
        unread: unreadNotificationsResponse.data?.length || 0
      });

      setNotifications(allNotificationsResponse.data || []);
      setUnreadNotifications(unreadNotificationsResponse.data || []);
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
      setError(error.message || 'Failed to fetch notifications');
      
      // Set empty arrays on error to prevent UI crashes
      setNotifications([]);
      setUnreadNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadOnly = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await notificationAPI.getUnreadNotifications();
      console.log('📨 Unread notifications fetched:', response.data?.length || 0);
      setUnreadNotifications(response.data || []);
    } catch (error: any) {
      console.error('Failed to fetch unread notifications:', error);
      setError(error.message || 'Failed to fetch unread notifications');
      setUnreadNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationIds: number[]) => {
    try {
      console.log('📖 Marking notifications as read:', notificationIds);
      
      await notificationAPI.markAsRead(notificationIds);
      
      // Update local state immediately for better UX
      setNotifications(prev => 
        prev.map(notification => 
          notificationIds.includes(notification.id) 
            ? { ...notification, isRead: true, readAt: new Date().toISOString() }
            : notification
        )
      );
      
      setUnreadNotifications(prev => 
        prev.filter(notification => !notificationIds.includes(notification.id))
      );
      
      console.log('✅ Notifications marked as read successfully');
    } catch (error: any) {
      console.error('Failed to mark notifications as read:', error);
      throw error;
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    console.log('🔄 Refreshing notifications...');
    await fetchNotifications();
  }, [fetchNotifications]);

  const refetch = useCallback(async () => {
    await fetchUnreadOnly();
  }, [fetchUnreadOnly]);

  useEffect(() => {
    fetchUnreadOnly();
  }, [fetchUnreadOnly]);

  return {
    notifications,
    unreadNotifications,
    loading,
    error,
    refetch,
    refreshNotifications,
    markAsRead
  };
};

export default useNotifications;
