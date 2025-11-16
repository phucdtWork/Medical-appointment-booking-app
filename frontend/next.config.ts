import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.pravatar.cc", "via.placeholder.com"], // Thêm "via.placeholder.com" để cho phép external image
  },
  transpilePackages: ["antd"],
  experimental: {
    esmExternals: "loose",
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
