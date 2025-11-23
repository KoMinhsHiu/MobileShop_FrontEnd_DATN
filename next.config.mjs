// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  images: {
    unoptimized: true,
    domains: [
      "localhost",
      "cdn2.cellphones.com.vn",
      "images.samsung.com",
      "www.apple.com",
      "i02.appmifile.com",
      "www.oppo.com",
      "res.cloudinary.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    minimumCacheTTL: 60,
    formats: ["image/webp", "image/avif"],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  i18n: {
    locales: ["en", "fr", "vi"],
    defaultLocale: "vi",
    localeDetection: false,
  },
};

export default nextConfig;
