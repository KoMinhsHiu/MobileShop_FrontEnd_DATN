import { useState, useEffect, useCallback } from 'react';
import { ActivityLog } from '../adminProfile.types';

// Mock data - trong thực tế sẽ lấy từ API
const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: '1',
    action: 'Đăng nhập',
    description: 'Đăng nhập vào hệ thống',
    timestamp: '2024-12-19 10:30:00',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0'
  },
  {
    id: '2',
    action: 'Cập nhật sản phẩm',
    description: 'Cập nhật thông tin sản phẩm iPhone 15 Pro',
    timestamp: '2024-12-19 09:15:00',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0'
  },
  {
    id: '3',
    action: 'Xóa đơn hàng',
    description: 'Xóa đơn hàng #12345',
    timestamp: '2024-12-18 16:45:00',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0'
  },
  {
    id: '4',
    action: 'Thêm sản phẩm mới',
    description: 'Thêm sản phẩm Samsung Galaxy S24 Ultra',
    timestamp: '2024-12-18 14:20:00',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0'
  },
  {
    id: '5',
    action: 'Cập nhật thông tin khách hàng',
    description: 'Cập nhật thông tin khách hàng #KH001',
    timestamp: '2024-12-18 11:30:00',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0'
  }
];

export const useActivityLog = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setActivityLogs(MOCK_ACTIVITY_LOGS);
    } catch (err) {
      setError('Không thể tải nhật ký hoạt động');
      console.error('Error fetching activity logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshActivityLogs = useCallback(() => {
    fetchActivityLogs();
  }, [fetchActivityLogs]);

  useEffect(() => {
    fetchActivityLogs();
  }, [fetchActivityLogs]);

  return {
    activityLogs,
    isLoading,
    error,
    refreshActivityLogs
  };
};
