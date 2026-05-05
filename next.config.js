/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "nexosol.se" }],
        destination: "https://www.nexosol.se/:path*",
        permanent: true,
      },
      { source: "/admin", destination: "https://nexoadmin.se", permanent: false },
      { source: "/admin/:path*", destination: "https://nexoadmin.se", permanent: false },
    ];
  },
};

module.exports = nextConfig
