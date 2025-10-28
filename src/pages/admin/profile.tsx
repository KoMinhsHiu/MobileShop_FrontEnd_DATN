import React from 'react';
import AdminLayout from '@/component/admin/AdminLayout';
import AdminProfile from '@/component/admin/profile';
import AdminGuard from '@/component/auth/AdminGuard';

const AdminProfilePage: React.FC = () => {
  return (
    <AdminGuard>
      <AdminLayout>
        <AdminProfile />
      </AdminLayout>
    </AdminGuard>
  );
};

// Custom layout for admin pages
AdminProfilePage.getLayout = (page: React.ReactElement) => {
  return page;
};

export default AdminProfilePage;
