/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['razorpay', 'socket.io-client'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

module.exports = nextConfig;