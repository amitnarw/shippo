import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "deliver.goshippo.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
