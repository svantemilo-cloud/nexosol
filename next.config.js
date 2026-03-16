/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/admin", destination: "https://nexoadmin.se", permanent: false },
      { source: "/admin/:path*", destination: "https://nexoadmin.se", permanent: false },
    ];
  },
};

module.exports = nextConfig
