import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // allow all images from Cloudinary
      }
    ],
  },
  experimental:{
    serverActions:{
      bodySizeLimit: "5mb",
    }
  }
};

export default nextConfig;
