import { NotificationsAPI } from "@/const/endPoint";
import axiosInstance from "./fetchData/axiosInstance";

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface NotificationResponse {
  status: string;
  message: string;
  data: Notification[];
}

export const notificationAPI = {
  getNotifications: async(): Promise<NotificationResponse> => {
    try {
      let token = null;
      try {
        const tokens = localStorage.getItem('phonehub_tokens');
        if (tokens) {
          const tokenData = JSON.parse(tokens);
          token = tokenData.accessToken || tokenData.access_token || tokenData.token;
        }
      } catch (error) {
        console.error('Error parsing token data:', error);
      }

      // Check if token exists
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await axiosInstance.get(`${NotificationsAPI}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error getting notifications:', error);
      throw new Error(error.response?.data?.message || 'Failed to get notifications');
    }
  },

  getUnreadNotifications: async(): Promise<NotificationResponse> => {
    try {
      let token = null;
      try {
        const tokens = localStorage.getItem('phonehub_tokens');
        if (tokens) {
          const tokenData = JSON.parse(tokens);
          token = tokenData.accessToken || tokenData.access_token || tokenData.token;
        }
      } catch (error) {
        console.error('Error parsing token data:', error);
      }

      // Check if token exists
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await axiosInstance.get(`${NotificationsAPI}/unread`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error getting unread notifications:', error);
      throw new Error(error.response?.data?.message || 'Failed to get unread notifications');
    }
  },

  markAsRead: async(notificationIds: number[]): Promise<void> => {
    try {
      let token = null;
      try {
        const tokens = localStorage.getItem('phonehub_tokens');
        if (tokens) {
          const tokenData = JSON.parse(tokens);
          token = tokenData.accessToken || tokenData.access_token || tokenData.token;
        }
      } catch (error) {
        console.error('Error parsing token data:', error);
      }

      // Check if token exists
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await axiosInstance.post(`${NotificationsAPI}/read`,
        { notificationIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error marking notifications as read:', error);
      throw new Error(error.response?.data?.message || 'Failed to mark notifications as read');
    }
  },
}

export default notificationAPI;