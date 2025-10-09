import React from 'react';
import AdminLayout from '@/component/admin/AdminLayout';
import AdminProfile from '@/component/admin/profile';

const AdminProfilePage: React.FC = () => {
  return (
    <AdminLayout>
      <AdminProfile />
    </AdminLayout>
  );
};

// Custom layout for admin pages
AdminProfilePage.getLayout = (page: React.ReactElement) => {
  return page;
};

export default AdminProfilePage;
