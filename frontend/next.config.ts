import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.pravatar.cc", "ui-avatars.com", "res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  transpilePackages: ["antd"],
  experimental: {
    optimizePackageImports: ["antd", "@ant-design/icons"],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
