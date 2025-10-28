import React from 'react';
import AdminLayout from '@/component/admin/AdminLayout';
import Reports from '@/component/admin/reports';
import MetaTags from '@/component/metaTags';
import AdminGuard from '@/component/auth/AdminGuard';

const AdminReports: React.FC = () => {
  return (
    <AdminGuard>
      <MetaTags 
        title="Thống kê doanh thu - Admin Dashboard - PhoneHub" 
        description="Báo cáo thống kê doanh thu chi tiết cho cửa hàng điện thoại PhoneHub"
      />
      <AdminLayout currentPage="/admin/reports">
        <Reports />
      </AdminLayout>
    </AdminGuard>
  );
};

// Custom layout for admin pages
AdminReports.getLayout = (page: React.ReactElement) => {
  return page;
};

export default AdminReports;
