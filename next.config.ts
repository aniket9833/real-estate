import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uwnfwpghzmgmvryfmpup.supabase.co',
        pathname: '/storage/v1/object/public/property-images/**',
      },
    ],
  },
};

export default nextConfig;
