/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'rukminim2.flixcart.com' },
      { protocol: 'https', hostname: 'dummyimage.com' },
      { protocol: 'https', hostname: '**.imgur.com' },
    ],
  },
  // Allow fetching from local backend during development
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
