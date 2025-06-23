/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // This prevents errors with packages that have native dependencies
    if (isServer) {
      config.externals.push('canvas', '@tensorflow/tfjs-node');
    }
    return config;
  },
};
export default nextConfig;
