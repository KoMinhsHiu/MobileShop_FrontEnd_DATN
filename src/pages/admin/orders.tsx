import React from 'react';
import AdminLayout from '@/component/admin/AdminLayout';
import { OrderManagement } from '@/component/admin/orders';

const AdminOrders: React.FC = () => {
  return (
    <AdminLayout currentPage="/admin/orders">
      <OrderManagement />
    </AdminLayout>
  );
};

// Custom layout for admin pages
AdminOrders.getLayout = (page: React.ReactElement) => {
  return page;
};

export default AdminOrders;
