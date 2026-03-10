import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ali",
        destination:
          "/?utm_source=ali&utm_medium=qr&utm_campaign=vti_virtual_2026",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
