import React from 'react';
import AdminLayout from '@/component/admin/AdminLayout';
import { OrderManagement } from '@/component/admin/orders';
import AdminGuard from '@/component/auth/AdminGuard';

const AdminOrders = () => {
  return (
    <AdminGuard>
      <AdminLayout currentPage="/admin/orders">
        <OrderManagement />
      </AdminLayout>
    </AdminGuard>
  );
};

// Custom layout for admin pages
AdminOrders.getLayout = (page: React.ReactElement) => {
  return page;
};

export default AdminOrders;
