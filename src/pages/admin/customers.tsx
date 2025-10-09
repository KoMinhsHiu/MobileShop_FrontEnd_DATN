import React from 'react';
import Head from 'next/head';
import AdminLayout from '../../component/admin/AdminLayout';
import CustomerManagement from '../../component/admin/customers/CustomerManagement';

const AdminCustomersPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Quản lý khách hàng - Admin Dashboard</title>
        <meta name="description" content="Quản lý khách hàng trong hệ thống admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AdminLayout currentPage="/admin/customers">
        <CustomerManagement />
      </AdminLayout>
    </>
  );
};

export default AdminCustomersPage;
