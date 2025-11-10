import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/component/admin/AdminLayout';
import AdminGuard from '@/component/auth/AdminGuard';
import { PhoneDetailManagement } from '@/component/admin/phones';

const AdminPhoneDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <AdminGuard>
      <Head>
        <title>Chi tiết điện thoại - Admin Dashboard</title>
        <meta name="description" content="Quản lý chi tiết điện thoại trong hệ thống admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AdminLayout currentPage="/admin/phones">
        <PhoneDetailManagement id={id as string} />
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminPhoneDetailPage;