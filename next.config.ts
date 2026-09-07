import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uwnfwpghzmgmvryfmpup.supabase.co',
        pathname: '/storage/v1/object/public/property-images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/photo-1602343168117-bb8ffe3e2e9f',
      },
    ],
  },
};

export default nextConfig;
