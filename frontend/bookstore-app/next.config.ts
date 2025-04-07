import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: ['http://192.168.*.*'], // 또는 여러 IP 추가 가능
  },  
};

export default nextConfig;
