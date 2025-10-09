import React from 'react';
import Head from 'next/head';
import AdminLayout from '../../component/admin/AdminLayout';
import ProductManagement from '../../component/admin/products/ProductManagement';

const AdminProductsPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Quản lý sản phẩm - Admin Dashboard</title>
        <meta name="description" content="Quản lý sản phẩm trong hệ thống admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AdminLayout currentPage="/admin/products">
        <ProductManagement />
      </AdminLayout>
    </>
  );
};

export default AdminProductsPage;
