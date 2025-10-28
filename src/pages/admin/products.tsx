import React from 'react';
import Head from 'next/head';
import AdminLayout from '../../component/admin/AdminLayout';
import ProductManagement from '../../component/admin/products/ProductManagement';
import AdminGuard from '@/component/auth/AdminGuard';

const AdminProductsPage: React.FC = () => {
  return (
    <AdminGuard>
      <Head>
        <title>Quản lý biến thể điện thoại - Admin Dashboard</title>
        <meta name="description" content="Quản lý biến thể điện thoại trong hệ thống admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AdminLayout currentPage="/admin/products">
        <ProductManagement />
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminProductsPage;
