// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  
  // FIX: Rewritten Webpack configuration for robust external module handling
  webpack: (config, { isServer }) => {
    // This configuration MUST only run on the server side (Node.js environment)
    if (isServer) {
      
      // 1. Define the custom externals we need to add.
      const customExternals = {
        // Force 'node-html-to-image' to be treated as a Node.js dependency
        'node-html-to-image': 'commonjs node-html-to-image',
      };

      // 2. Wrap the existing externals or define new ones using the correct array format.
      // This is the structure that satisfies the Webpack schema validator.
      config.externals = Array.isArray(config.externals)
        ? [...config.externals, customExternals] // If already an array, append ours
        : [config.externals, customExternals]; // If an object/function, wrap both in an array

      // 3. Add a rule to handle 'handlebars' correctly
      config.module.rules.push({
        test: /node_modules[\\/]handlebars[\\/]/,
        use: [
          {
            loader: 'node-loader',
            options: {}
          }
        ]
      });
    }

    return config;
  },
};

module.exports = nextConfig;