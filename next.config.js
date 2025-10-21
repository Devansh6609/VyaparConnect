/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this block to ignore the problematic packages during client build
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude these packages from the client-side bundle
      config.externals.push(
        'node-html-to-image', 
        'handlebars', 
        'puppeteer'
      );
    }
    return config;
  },
};

module.exports = nextConfig;
