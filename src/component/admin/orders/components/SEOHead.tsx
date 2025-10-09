import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Quản lý đơn hàng - Admin Dashboard',
  description = 'Quản lý và theo dõi đơn hàng trong hệ thống e-commerce. Xem chi tiết, cập nhật trạng thái và quản lý giao hàng.',
  keywords = 'quản lý đơn hàng, admin, e-commerce, giao hàng, trạng thái đơn hàng'
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="noindex, nofollow" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
};

export default SEOHead;
