/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@tirehub/shared'],
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
