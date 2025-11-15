import AdminLayout from "@/component/admin/AdminLayout";
import { InventoryManagement } from "@/component/admin/inventories";
import AdminGuard from "@/component/auth/AdminGuard";
import Head from "next/head";

const AdminInventoriesPage = () => {
  return (
    <AdminGuard>
      <Head>
        <title>Quản lý tồn kho - Admin Dashboard</title>
        <meta name="description" content="Quản lý tồn kho trong hệ thống admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AdminLayout currentPage="/admin/inventories">
        <InventoryManagement />
      </AdminLayout>
    </AdminGuard>
  );
}

export default AdminInventoriesPage;