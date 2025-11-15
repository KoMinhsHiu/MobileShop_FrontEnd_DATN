import AdminLayout from "@/component/admin/AdminLayout";
import { VoucherManagement } from "@/component/admin/vouchers";
import AdminGuard from "@/component/auth/AdminGuard";
import Head from "next/head";

const AdminVouchersPage = () => {
  return (
    <AdminGuard>
      <Head>
        <title>Quản lý chuỗi voucher - Admin Dashboard</title>
        <meta name="description" content="Quản lý chuỗi voucher trong hệ thống admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AdminLayout currentPage="/admin/vouchers">
        <VoucherManagement />
      </AdminLayout>
    </AdminGuard>
  );
}

export default AdminVouchersPage;