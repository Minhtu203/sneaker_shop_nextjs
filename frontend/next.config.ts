/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn2.fptshop.com.vn',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', 
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.nike.com', 
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.adidas.com', 
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net', 
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;