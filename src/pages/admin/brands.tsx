import AdminLayout from "@/component/admin/AdminLayout";
import { BrandManagement } from "@/component/admin/brands";
import AdminGuard from "@/component/auth/AdminGuard";
import Head from "next/head";

const AdminBrandsPage = () => {
  return (
    <AdminGuard>
      <Head>
        <title>Quản lý thương hiệu - Admin Dashboard</title>
        <meta name="description" content="Quản lý thương hiệu trong hệ thống admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AdminLayout currentPage="/admin/brands">
        <BrandManagement />
      </AdminLayout>
    </AdminGuard>
  );
}

export default AdminBrandsPage;