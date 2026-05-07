/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

/**
 * CSP anpassad för NexoSol: Next, inline JSON-LD/styles, GTM‑taggar
 * (som laddar tredjeparts‑script dynamiskt) och webhook/Supabase (connect).
 * Strama åt script‑white‑list löpande när taggar är frysade.
 */
function contentSecurityPolicy() {
  // Without 'unsafe-eval' some Next/Chromium-byggen eller tillägg stoppar bundles → halv sidor
  // förblir med opacity:0 (Framer) och interaktiva komponenter slutar svara likadant lokalt och i prod‑preview.
  const scriptSrc = "'self' 'unsafe-inline' 'unsafe-eval' https:";
  return [
    "default-src 'self'",
    // unsafe-inline = inline bootstrap + strukturerade data‑skript i layout.
    // https: tillåter skript domäner som GTM injicerar vid körning.
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com data:",
    // n8n-webhook, GA4, Supabase, GTM‑nät. ws:/wss: behövs för Next HMR lokalt och varianter över HTTPS.
    "connect-src 'self' https: ws: wss: blob:",
    "frame-src 'self' https://www.googletagmanager.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isProd ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy(),
  },
];

const hstsHeaders = isProd
  ? [
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ]
  : [];

const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...securityHeaders, ...hstsHeaders],
      },
    ];
  },

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

module.exports = nextConfig;
