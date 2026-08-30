import type { NextConfig } from "next";

/**
 * 🔥 MASI FAST RESULTS - Next.js Configuration
 * 
 * LOCAL DEVELOPMENT: Proxies API to localhost:8000
 * PRODUCTION (Vercel): Uses NEXT_PUBLIC_API_URL from environment
 */

// Determine backend URL
const getBackendUrl = (): string => {
  // 🔥 MUHIMU: Angalia NEXT_PUBLIC_API_URL kwanza
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  
  // For local development, use BACKEND_URL or default
  const backend = process.env.BACKEND_URL || "http://127.0.0.1:8000";
  return backend.replace(/\/$/, "");
};

const backendBase = getBackendUrl();

const isVercel = process.env.VERCEL === "1";
const isProduction = process.env.NODE_ENV === "production";

console.log(`🔧 Next.js Config:`);
console.log(`   Environment: ${process.env.NODE_ENV}`);
console.log(`   Vercel: ${isVercel}`);
console.log(`   Backend URL: ${backendBase}`);

const nextConfig: NextConfig = {
  // ============================================================
  // 🔥 IMAGES CONFIGURATION
  // ============================================================
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      // 🔥 DOMAIN YAKU - bubblesmanage.com
      {
        protocol: "https",
        hostname: "bubblesmanage.com",
      },
      {
        protocol: "https",
        hostname: "*.bubblesmanage.com",
      },
      // 🔥 VERCEL DEFAULT DOMAIN
      {
        protocol: "https",
        hostname: "fast-results-frontend.vercel.app",
      },
      {
        protocol: "https",
        hostname: "*.vercel.app",
      },
      // 🔥 BACKEND DOMAINS
      {
        protocol: "https",
        hostname: "*.render.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },

  // ============================================================
  // 🔥 ENVIRONMENT VARIABLES
  // ============================================================
  env: {
    NEXT_PUBLIC_API_URL: backendBase,
    NEXT_PUBLIC_IS_VERCEL: String(isVercel),
    NEXT_PUBLIC_IS_PRODUCTION: String(isProduction),
    // 🔥 DOMAIN ZA FRONTEND
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || "https://bubblesmanage.com",
    NEXT_PUBLIC_FRONTEND_URLS: JSON.stringify([
      "https://bubblesmanage.com",
      "https://www.bubblesmanage.com",
      "https://fast-results-frontend.vercel.app",
    ]),
  },

  // ============================================================
  // 🔥 API REWRITES (Local development only)
  // ============================================================
  async rewrites() {
    if (isProduction || isVercel) {
      console.log("🚀 Production mode: Rewrites disabled");
      return [];
    }

    console.log("🔄 Development mode: Rewrites enabled");
    return [
      {
        source: "/api/:path*",
        destination: `${backendBase}/api/:path*`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${backendBase}/api/v1/:path*`,
      },
      {
        source: "/docs",
        destination: `${backendBase}/docs`,
      },
      {
        source: "/openapi.json",
        destination: `${backendBase}/openapi.json`,
      },
    ];
  },

  // ============================================================
  // 🔥 REDIRECTS
  // ============================================================
  async redirects() {
    return [
      {
        source: "/api",
        destination: "/api/v1",
        permanent: false,
      },
      // 🔥 Redirect www to non-www
      {
        source: "/www.bubblesmanage.com/:path*",
        destination: "https://bubblesmanage.com/:path*",
        permanent: true,
      },
    ];
  },

  // ============================================================
  // 🔥🔥🔥 PWA HEADERS - PRO MAX! 🔥🔥🔥
  // ============================================================
  async headers() {
    return [
      // 🔥 SECURITY HEADERS
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },

      // 🔥 PWA - Service Worker
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },

      // 🔥 PWA - Manifest
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/json; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },

      // 🔥 PWA - Icons (Cache kwa muda mrefu)
      {
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Content-Type",
            value: "image/png",
          },
        ],
      },

      // 🔥 PWA - Apple Touch Icon
      {
        source: "/apple-touch-icon.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Content-Type",
            value: "image/png",
          },
        ],
      },

      // 🔥 PWA - Favicon
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Content-Type",
            value: "image/x-icon",
          },
        ],
      },

      // 🔥 CORS Headers for API
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Authorization, Content-Type, Accept, Origin, X-Requested-With",
          },
        ],
      },
    ];
  },

  // ============================================================
  // 🔥🔥🔥 TURBOPACK FIX - MUHIMU SANA! 🔥🔥🔥
  // ============================================================
  // 🔥 HII INASULUHISHA ERROR YA TURBOPACK!
  turbopack: {
    // Empty config - inaambia Next.js kwamba unajua unachofanya
    // Na inaepusha error ya webpack conflict
  },

  // ============================================================
  // 🔥 WEBPACK CONFIG - Inabaki kwa compatibility
  // ============================================================
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },

  // ============================================================
  // 🔥 OUTPUT & BUILD
  // ============================================================
  output: "standalone",

  compiler: {
    removeConsole: isProduction,
  },

  // ============================================================
  // 🔥 OTHER CONFIGS
  // ============================================================
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false,

  // ============================================================
  // 🔥 EXPERIMENTAL FEATURES
  // ============================================================
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
};

export default nextConfig;