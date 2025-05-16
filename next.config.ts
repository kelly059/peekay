// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'], // ✅ Allow Cloudinary image domains
  },
  experimental: {
    // Only include this if your Next.js version supports it
    // Remove or comment out if it's causing a type error
    // serverActions: true,
  },
};

export default nextConfig;
