import AdminLayout from "@/component/admin/AdminLayout";
import { CategoryManagement } from "@/component/admin/categories";
import AdminGuard from "@/component/auth/AdminGuard";
import Head from "next/head";

const AdminCategoriesPage = () => {
  return (
    <AdminGuard>
      <Head>
        <title>Quản lý danh mục - Admin Dashboard</title>
        <meta name="description" content="Quản lý danh mục trong hệ thống admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AdminLayout currentPage="/admin/categories">
        <CategoryManagement />
      </AdminLayout>
    </AdminGuard>
  );
}

export default AdminCategoriesPage;