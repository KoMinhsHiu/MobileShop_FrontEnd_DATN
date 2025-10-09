import React from 'react';
import AdminLayout from '@/component/admin/AdminLayout';
import Dashboard from '@/component/admin/dashboard/Dashboard';
import MetaTags from '@/component/metaTags';

const AdminDashboard: React.FC = () => {
  return (
    <>
      <MetaTags 
        title="Admin Dashboard - PhoneHub" 
        description="Quản lý cửa hàng điện thoại PhoneHub - Dashboard tổng quan"
      />
      <AdminLayout currentPage="/admin">
        <Dashboard />
      </AdminLayout>
    </>
  );
};

// Custom layout for admin pages
AdminDashboard.getLayout = (page: React.ReactElement) => {
  return page;
};

export default AdminDashboard;

