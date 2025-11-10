import AdminLayout from "@/component/admin/AdminLayout";
import { PhoneManagement } from "@/component/admin/phones";
import AdminGuard from "@/component/auth/AdminGuard";
import Head from "next/head";

const AdminPhonesPage = () => {
  return (
    <AdminGuard>
      <Head>
        <title>Quản lý điện thoại - Admin Dashboard</title>
        <meta name="description" content="Quản lý điện thoại trong hệ thống admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AdminLayout currentPage="/admin/phones">
        <PhoneManagement />
      </AdminLayout>
    </AdminGuard>
  );
}

export default AdminPhonesPage;