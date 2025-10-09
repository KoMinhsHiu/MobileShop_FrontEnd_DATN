import React from 'react';
import AdminLayout from '@/component/admin/AdminLayout';
import Dashboard from '@/component/admin/dashboard/Dashboard';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout currentPage="/admin">
      <Dashboard />
    </AdminLayout>
  );
};

// Custom layout for admin pages
AdminDashboard.getLayout = (page: React.ReactElement) => {
  return page;
};

export default AdminDashboard;

